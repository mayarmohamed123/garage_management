import React, { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../../services/productService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import ProductForm from './ProductForm';
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';

const InventoryPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { data, isLoading, error: loadError } = useGetProductsQuery({ search, page, limit: 10 });
  const [deleteProduct] = useDeleteProductMutation();
  const [error, setError] = useState('');

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteProduct(id).unwrap();
        } catch (err) {
            setError(err.data?.message || 'Failed to delete product');
        }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Inventory"
        description="Manage spare parts, stock levels, and pricing."
        actionText="Add Part"
        onAction={() => handleOpenModal()}
      />

      <SearchInput 
        placeholder="Search by part name or SKU..."
        value={search}
        onChange={setSearch}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={18} /></button>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Loading inventory..." />
      ) : loadError ? (
        <ErrorState message="Error loading products." />
      ) : (
        <Table headers={['Part Info', 'SKU', 'Stock', 'Price', 'Actions']}>
          {data?.data?.products?.length > 0 ? (
            data.data.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-3 border border-slate-200 overflow-hidden">
                    {product.image ? (
                        <img src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                        <Package size={20} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{product.category || 'Spare Part'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-slate-500">{product.sku}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`font-bold ${product.stockQuantity <= (product.minStock || 5) ? 'text-red-600' : 'text-slate-900'}`}>
                        {product.stockQuantity}
                    </span>
                    {product.stockQuantity <= (product.minStock || 5) && (
                        <AlertTriangle size={14} className="ml-2 text-red-500" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">Min: {product.minStock || 5}</div>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {product.price ? `$${parseFloat(product.price).toFixed(2)}` : '$0.00'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState message="No products found in inventory." icon={Package} />
              </TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-100">
        <p>Showing {data?.data?.products?.length || 0} items</p>
        <div className="flex space-x-2">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-medium font-sans">
             Previous
           </button>
           <button 
             disabled={page >= (data?.data?.totalPages || 1)}
             onClick={() => setPage(p => p + 1)}
             className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all font-medium font-sans">
             Next
           </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedProduct ? 'Update Inventory' : 'Add New Spare Part'}
      >
        <ProductForm 
          product={selectedProduct} 
          onSuccess={handleCloseModal} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default InventoryPage;
