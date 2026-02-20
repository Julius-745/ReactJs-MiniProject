import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategoryStore } from '@/store/category-store';
import type { ProductInterface } from '@/store/product-store';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Partial<ProductInterface>) => Promise<void>;
  initialValues?: Partial<ProductInterface> | null;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

const emptyForm: Partial<ProductInterface> = {
  title: '',
  description: '',
  category: '',
  price: 0,
  discountPercentage: 0,
  stock: 0,
  brand: '',
  sku: '',
  weight: 0,
  warrantyInformation: '',
  shippingInformation: '',
  returnPolicy: '',
  minimumOrderQuantity: 1,
  thumbnail: '',
};

export default function ProductFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: ProductFormDialogProps) {
  const { categories, isLoadingCategory } = useCategoryStore();
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevInitialValues, setPrevInitialValues] = useState(initialValues);
  const [form, setForm] = useState<Partial<ProductInterface>>(
    initialValues ?? emptyForm
  );

  if (open !== prevOpen || initialValues !== prevInitialValues) {
    setPrevOpen(open);
    setPrevInitialValues(initialValues);
    if (open) {
      setForm(initialValues ?? emptyForm);
    }
  }

  const handleChange = (field: keyof ProductInterface, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === 'create' ? '✨ Add New Product' : '✏️ Edit Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details below to add a new product.'
              : 'Update the product details below.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 py-2"
          id="product-form"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-title">Title *</Label>
              <Input
                id="pf-title"
                placeholder="Product title"
                value={form.title ?? ''}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-brand">Brand</Label>
              <Input
                id="pf-brand"
                placeholder="Brand name"
                value={form.brand ?? ''}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pf-description">Description</Label>
            <Textarea
              id="pf-description"
              placeholder="Product description..."
              value={form.description ?? ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-category">Category *</Label>
              <Select
                defaultValue="category"
                value={form.category ?? ''}
                onValueChange={(val) => handleChange('category', val)}
                disabled={isLoadingCategory}
              >
                <SelectTrigger id="pf-category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-sku">SKU</Label>
              <Input
                id="pf-sku"
                placeholder="SKU code"
                value={form.sku ?? ''}
                onChange={(e) => handleChange('sku', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-price">Price ($) *</Label>
              <Input
                id="pf-price"
                type="number"
                placeholder="0"
                min={0}
                step={0.01}
                value={form.price || ''}
                onChange={(e) =>
                  handleChange('price', parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-discount">Discount (%)</Label>
              <Input
                id="pf-discount"
                type="number"
                placeholder="0%"
                min={0}
                max={100}
                step={0.01}
                value={form.discountPercentage || ''}
                onChange={(e) =>
                  handleChange(
                    'discountPercentage',
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-stock">Stock *</Label>
              <Input
                id="pf-stock"
                type="number"
                placeholder="0"
                min={0}
                value={form.stock || ''}
                onChange={(e) =>
                  handleChange('stock', parseInt(e.target.value) || 0)
                }
                required
              />
            </div>
          </div>

          {/* Weight & Min Order Qty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-weight">Weight (g)</Label>
              <Input
                id="pf-weight"
                type="number"
                min={0}
                value={form.weight || ''}
                onChange={(e) =>
                  handleChange('weight', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-moq">Min Order Qty</Label>
              <Input
                id="pf-moq"
                type="number"
                min={1}
                value={form.minimumOrderQuantity || ''}
                onChange={(e) =>
                  handleChange(
                    'minimumOrderQuantity',
                    parseInt(e.target.value) || 1
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-warranty">Warranty</Label>
              <Input
                id="pf-warranty"
                placeholder="1 year warranty"
                value={form.warrantyInformation ?? ''}
                onChange={(e) =>
                  handleChange('warrantyInformation', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-shipping">Shipping</Label>
              <Input
                id="pf-shipping"
                placeholder="Ships in 1-2 weeks"
                value={form.shippingInformation ?? ''}
                onChange={(e) =>
                  handleChange('shippingInformation', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-return">Return Policy</Label>
              <Input
                id="pf-return"
                placeholder="30 days return"
                value={form.returnPolicy ?? ''}
                onChange={(e) => handleChange('returnPolicy', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pf-thumbnail">Thumbnail URL</Label>
            <Input
              id="pf-thumbnail"
              placeholder="https://..."
              value={form.thumbnail ?? ''}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
            />
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-lg border object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = 'none')
                }
              />
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={isLoading || !form.title || !form.category}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : mode === 'create' ? (
              'Create Product'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
