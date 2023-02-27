SELECT
  SKU as 'id',
  Brand as 'brand',
  Color as 'color',
  Size as 'size',
  Fabric_Type as 'fabric_type',
  Product_Type as 'product_type',
  Main_Quantity as 'main_quantity'
FROM
  [InventoryLevels_Import]
WHERE
  SKU IS NOT NULL

SELECT
  MAX(ProductId) as 'product_id',
  MAX(VariantID) as 'variantID',
  Sku as 'id',
  MAX(Price) as 'item_price'
FROM
  [ShopifyProductVariantsDE-felinagroup]
WHERE
  Sku NOT LIKE '%---'
  AND SKU IS NOT NULL
GROUP BY
  Sku

SELECT
  product_id as 'id',
  MAX(item_price) as 'attribute:price',
  MAX(fabric_type) as 'relatedCatalogObject:FabricType',
  STRING_AGG (size, '|') as 'relatedCatalogObject:Size',
  STRING_AGG (color, '|') as 'relatedCatalogObject:Color',
  MAX(brand) as 'relatedCatalogObject:Brand',
  CASE
    WHEN SUM(CONVERT(INT, main_quantity)) >= 125 THEN 100
    WHEN SUM(CONVERT(INT, main_quantity)) < 125 THEN 0
  END as 'attribute:inventoryCount',
  MAX(product_type) as 'relatedCatalogObject:ProductType',
  STRING_AGG (id, '|') as 'skus',
  STRING_AGG(variantID, '|') as 'relatedCatalogObject:VariantID'
FROM
  [Variant_Products]
WHERE
  product_id IS NOT NULL
GROUP BY
  product_id

SELECT
  ID as 'id',
  Image as 'attribute:imageUrl',
  Title as 'attribute:name',
  Description as 'attribute:description',
  Price as 'attribute:price',
  Tags as 'relatedCatalogObject:categories'
FROM
  [ShopifyProductDE-felinagroup]