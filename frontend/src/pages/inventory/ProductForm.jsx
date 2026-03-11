import React, { useState, useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../../services/productService';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    stock: '',
    minStock: '5',
    category: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    if (product && product.id !== formData.id) {
        const timer = setTimeout(() => {
            setFormData({
                id: product.id,
                name: product.name || '',
                description: product.description || '',
                sku: product.sku || '',
                price: product.price || '',
                stock: product.stock || '',
                minStock: product.minStock || '5',
                category: product.category || ''
            });
            if (product.imageUrl) {
                setImagePreview(`${import.meta.env.VITE_API_BASE_URL}/${product.imageUrl.replace(/\\/g, '/')}`);
            }
        }, 0);
        return () => clearTimeout(timer);
    }
  }, [product, formData.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && key !== 'id') {
            data.append(key, formData[key]);
        }
    });
    if (image) {
      data.append('image', image);
    }

    try {
      if (product) {
        await updateProduct({ id: product.id, data }).unwrap();
      } else {
        await createProduct(data).unwrap();
      }
      onSuccess();
    } catch (err) {
      setError(err.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
      
      <div className="flex items-center justify-center mb-4">
        <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                    <Package className="text-slate-300" size={32} />
                )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl text-[10px] font-bold uppercase">
                Change
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Part Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">SKU / Part Number</label>
          <input
            type="text"
            required
            placeholder="PRT-001"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none uppercase"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
          <input
            type="text"
            placeholder="e.g. Engine"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Min Stock</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
        <textarea
          rows="2"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
        >
          {isCreating || isUpdating ? 'Saving...' : product ? 'Update Part' : 'Add Part'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
