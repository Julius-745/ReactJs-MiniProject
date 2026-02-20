import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ProductInterface } from '@/store/product-store';

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductInterface | null;
}

export default function ProductDetailDialog({
  open,
  onOpenChange,
  product,
}: ProductDetailDialogProps) {
  if (!product) return null;

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {product.images && product.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  className="h-40 w-40 flex-shrink-0 rounded-xl border object-cover shadow-sm transition-transform hover:scale-105"
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {product.category.replace(/-/g, ' ')}
            </Badge>
            {product.brand && <Badge variant="outline">{product.brand}</Badge>}
            <Badge
              variant={
                product.availabilityStatus === 'In Stock'
                  ? 'default'
                  : 'destructive'
              }
            >
              {product.availabilityStatus}
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Price
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  ${discountedPrice.toFixed(2)}
                </p>
                {product.discountPercentage > 0 && (
                  <p className="text-muted-foreground text-sm line-through">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <Badge className="mt-1 border-green-500/20 bg-green-500/10 text-green-600">
                  {product.discountPercentage}% off
                </Badge>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Rating
              </p>
              <p className="text-2xl font-bold">⭐ {product.rating}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <DetailRow label="Stock" value={String(product.stock)} />
            <DetailRow label="SKU" value={product.sku} />
            <DetailRow label="Weight" value={`${product.weight}g`} />
            <DetailRow
              label="Min Order"
              value={String(product.minimumOrderQuantity)}
            />
            <DetailRow label="Warranty" value={product.warrantyInformation} />
            <DetailRow label="Shipping" value={product.shippingInformation} />
            <DetailRow label="Return Policy" value={product.returnPolicy} />
            {product.dimensions && (
              <DetailRow
                label="Dimensions"
                value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
              />
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-2 text-xs tracking-wider uppercase">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  );
}
