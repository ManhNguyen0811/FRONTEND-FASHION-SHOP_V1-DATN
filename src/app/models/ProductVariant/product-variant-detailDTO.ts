export interface ProductVariantDetailDTO{
  id:number;
  variantImage: string;
  name: string;
  colorId: number;
  color: string;
  size: string;
  basePrice: number;
  salePrice: number;
  inWishlist: boolean
}
