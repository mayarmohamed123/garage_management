import React, { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../../services/productService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import ProductForm from './ProductForm';
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, AlertCircle, X } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
          <p className="text-slate-500 text-sm mt-1">Manage spare parts, stock levels, and pricing.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add Part
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by part name or SKU..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={18} /></button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading inventory...
        </div>
      ) : loadError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            Error loading products.
        </div>
      ) : (
        <Table headers={['Part Info', 'SKU', 'Stock', 'Price', 'Actions']}>
          {data?.data?.products?.length > 0 ? (
            data.data.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-3 border border-slate-200 overflow-hidden">
                    {product.imageUrl ? (
                        <img src={`${import.meta.env.VITE_API_BASE_URL}/${product.imageUrl.replace(/\\/g, '/')}`} alt={product.name} className="h-full w-full object-cover" />
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
                    <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-slate-900'}`}>
                        {product.stock}
                    </span>
                    {product.stock <= product.minStock && (
                        <AlertTriangle size={14} className="ml-2 text-red-500" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">Min: {product.minStock}</div>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  ${parseFloat(product.price).toFixed(2)}
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
              <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                No products found in inventory.
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
