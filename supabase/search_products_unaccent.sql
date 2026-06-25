-- Enable the unaccent extension (ignore if already enabled)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Accent-insensitive product search used by /api/chat
CREATE OR REPLACE FUNCTION search_products_unaccent(
  search_keywords text[],
  max_results int DEFAULT 3
)
RETURNS TABLE (
  id        uuid,
  name      text,
  slug      text,
  price     numeric,
  category  text,
  universe  text,
  short_description text,
  image_url text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.price::numeric,
    p.category,
    p.universe,
    p.short_description,
    (
      SELECT pm.url
      FROM product_media pm
      WHERE pm.product_id = p.id
        AND pm.type = 'image'
      ORDER BY (pm.is_featured IS TRUE) DESC, pm.position ASC NULLS LAST
      LIMIT 1
    ) AS image_url
  FROM products p
  WHERE p.status = 'active'
    AND EXISTS (
      SELECT 1
      FROM unnest(search_keywords) AS t(kw)
      WHERE unaccent(lower(p.name))
              ILIKE '%' || unaccent(lower(t.kw)) || '%'
         OR unaccent(lower(COALESCE(p.short_description, '')))
              ILIKE '%' || unaccent(lower(t.kw)) || '%'
         OR unaccent(lower(p.category))
              ILIKE '%' || unaccent(lower(t.kw)) || '%'
    )
  LIMIT max_results;
END;
$$;
