import { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { Plus, Search, ArrowUpDown, Pencil, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductStore, type ProductInterface } from '@/store/product-store';
import { useModalStore } from '@/store/modal-store';
import ProductFormDialog from '@/components/form/product-form-dialog';
import DeleteConfirmDialog from '@/components/form/delete-confirm-dialog';
import ProductDetailDialog from '@/components/form/product-detail-dialog';
import { useCategoryStore } from '@/store/category-store';

const LIMIT = 10;

const ProductsPage = () => {
  const {
    products,
    isLoadingProduct,
    isMutatingProduct,
    params,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setParams,
  } = useProductStore();

  const { fetchCategories } = useCategoryStore();

  const { modal, openModal, closeModal } = useModalStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const t = setTimeout(() => {
      setParams({ search, skip: 0 });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (sortBy) {
      setParams({ sortBy, order });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  const currentPage = Math.floor((params.skip ?? 0) / LIMIT) + 1;
  const totalPages = Math.max(1, Math.ceil(products.total / LIMIT));

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setParams({ skip: (page - 1) * LIMIT, limit: LIMIT });
  };

  const handleCreate = async (values: Partial<ProductInterface>) => {
    await createProduct(values);
    closeModal();
  };

  const handleUpdate = async (values: Partial<ProductInterface>) => {
    if (modal?.type !== 'edit') return;
    await updateProduct(modal.product.id, values);
    closeModal();
  };

  const handleDelete = async () => {
    if (modal?.type !== 'delete') return;
    await deleteProduct(modal.product.id);
    closeModal();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your product catalog
          </p>
        </div>
        <Button
          id="btn-add-product"
          onClick={() => openModal({ type: 'create' })}
          className="gap-2 shadow-md transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          id="input-search-product"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead align="center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('title')}
                  className="gap-1 font-semibold"
                >
                  Title <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('price')}
                  className="gap-1 font-semibold"
                >
                  Price <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="pr-10 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoadingProduct ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-1 h-3 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-10 w-10 opacity-30" />
                    <p className="text-base font-medium">No products found</p>
                    <p className="text-sm">
                      Try adjusting your search or add a new product.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => openModal({ type: 'view', product })}
                >
                  <TableCell>
                    <p className="line-clamp-1 text-start font-medium">
                      {product.title}
                    </p>
                    <p className="text-muted-foreground text-start text-xs">
                      {product.brand || '—'}
                    </p>
                  </TableCell>

                  <TableCell className="text-start">
                    <Badge variant="secondary" className="capitalize">
                      {product.category.replace(/-/g, ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-start">
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                    {product.discountPercentage > 0 && (
                      <p className="text-xs text-green-500">
                        {product.discountPercentage}% off
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-start">
                    <p>{product.stock}</p>
                    <p
                      className={`text-xs ${
                        product.availabilityStatus === 'In Stock'
                          ? 'text-green-500'
                          : product.availabilityStatus === 'Low Stock'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}
                    >
                      {product.availabilityStatus}
                    </p>
                  </TableCell>

                  <TableCell className="text-start">
                    <span className="text-sm">⭐ {product.rating}</span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        id={`btn-view-${product.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal({ type: 'view', product });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        id={`btn-edit-${product.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal({ type: 'edit', product });
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        id={`btn-delete-${product.id}`}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal({ type: 'delete', product });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex min-w-full items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {products.total} products — Page {currentPage} of {totalPages}
        </p>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage <= 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (page === 2 && currentPage > 3) {
                return (
                  <PaginationItem key="start-ellipsis">
                    <span className="text-muted-foreground px-2">…</span>
                  </PaginationItem>
                );
              }
              if (page === totalPages - 1 && currentPage < totalPages - 2) {
                return (
                  <PaginationItem key="end-ellipsis">
                    <span className="text-muted-foreground px-2">…</span>
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ProductFormDialog
        open={modal?.type === 'create'}
        onOpenChange={(open) => !open && closeModal()}
        onSubmit={handleCreate}
        mode="create"
        isLoading={isMutatingProduct}
      />

      <ProductFormDialog
        open={modal?.type === 'edit'}
        onOpenChange={(open) => !open && closeModal()}
        onSubmit={handleUpdate}
        initialValues={modal?.type === 'edit' ? modal.product : null}
        mode="edit"
        isLoading={isMutatingProduct}
      />

      <DeleteConfirmDialog
        open={modal?.type === 'delete'}
        onOpenChange={(open) => !open && closeModal()}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${modal?.type === 'delete' ? modal.product.title : ''}"? This action cannot be undone.`}
        isLoading={isMutatingProduct}
      />

      <ProductDetailDialog
        open={modal?.type === 'view'}
        onOpenChange={(open) => !open && closeModal()}
        product={modal?.type === 'view' ? modal.product : null}
      />
    </div>
  );
};

export default ProductsPage;
