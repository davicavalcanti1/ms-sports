import { useEffect, useState } from 'react';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';
import { supabase } from '../lib/supabase';

export default function Admin() {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [loading, setLoading] = useState(false);

    const loadProducts = () => {
        getProducts(true).then(setProductsList);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleEditClick = (product: Product) => {
        setEditingId(product.id);
        setEditForm({ ...product });
    };

    const handleSave = async (id: string) => {
        setLoading(true);
        try {
            const { data: existing } = await supabase
                .from('products_new')
                .select('id')
                .eq('id', id)
                .single();

            const payload = {
                id: id,
                title: editForm.name,
                base_price: editForm.price,
                category: editForm.category,
                is_visible: editForm.is_visible,
            };

            if (existing) {
                await supabase.from('products_new').update(payload).eq('id', id);
            } else {
                await supabase.from('products_new').insert([payload]);
            }

            setEditingId(null);
            loadProducts();
            alert('Produto atualizado com sucesso!');
        } catch (error) {
            console.error('Error saving product', error);
            alert('Erro ao salvar o produto.');
        } finally {
            setLoading(false);
        }
    };

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [bulkPrice, setBulkPrice] = useState<number>(150);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Free-input prices per core category
    const [catPrices, setCatPrices] = useState<Record<string, number>>({
        Futebol: 150,
        Feminino: 150,
        Infantil: 130,
        NBA: 150,
    });

    const categories = Array.from(new Set(productsList.map(p => p.category))).sort();

    // Core categories requested by user
    const coreCategories = [
        { id: 'all', label: 'Todos' },
        { id: 'Futebol', label: 'Masculina (Futebol)' },
        { id: 'Feminino', label: 'Feminina' },
        { id: 'Infantil', label: 'Kids (Infantil)' },
        { id: 'NBA', label: 'Basquete (NBA)' }
    ];

    const handleBulkUpdate = async (targetCategory: string = selectedCategory, targetPrice: number = bulkPrice) => {
        if (!targetCategory) {
            alert('Por favor, selecione uma categoria.');
            return;
        }
        if (!confirm(`Tem certeza que deseja alterar o preço de todos os produtos da categoria "${targetCategory}" para R$ ${targetPrice.toFixed(2)}?`)) {
            return;
        }

        setBulkLoading(true);
        try {
            const productsInCategory = productsList.filter(p => p.category === targetCategory);

            if (productsInCategory.length === 0) {
                alert(`Nenhum produto encontrado na categoria "${targetCategory}".`);
                setBulkLoading(false);
                return;
            }

            // Test with just the first product and show full error detail
            const first = productsInCategory[0];
            console.log('[BulkUpdate] Testing with first product:', first.id, '| target price:', targetPrice);

            // Try update first on the first product
            const { data: testUpdate, error: testUpdateError } = await supabase
                .from('products_new')
                .update({ base_price: targetPrice })
                .eq('id', first.id)
                .select('id');

            console.log('[BulkUpdate] Update result:', { testUpdate, testUpdateError });

            if (testUpdateError) {
                alert(`Erro ao atualizar: ${testUpdateError.message}\nCódigo: ${testUpdateError.code}\n\nVerifique as políticas RLS no Supabase.`);
                return;
            }

            // No existing row — try insert
            if (!testUpdate || testUpdate.length === 0) {
                console.log('[BulkUpdate] No rows updated, trying insert for:', first.id);
                const { error: testInsertError } = await supabase
                    .from('products_new')
                    .insert({
                        id: first.id,
                        title: first.name,
                        base_price: targetPrice,
                        category: first.category,
                        is_visible: first.is_visible ?? true,
                    });

                console.log('[BulkUpdate] Insert error:', testInsertError);

                if (testInsertError) {
                    alert(`Erro ao inserir: ${testInsertError.message}\nCódigo: ${testInsertError.code}\n\nVerifique as políticas RLS no Supabase para INSERT.`);
                    return;
                }
            }

            // First product worked — now run the rest
            let successCount = 1; // Counted the first product
            let errorCount = 0;
            const errors: string[] = [];

            for (const p of productsInCategory.slice(1)) {
                const { data: updated, error: updateError } = await supabase
                    .from('products_new')
                    .update({ base_price: targetPrice })
                    .eq('id', p.id)
                    .select('id');

                if (updateError) {
                    errorCount++;
                    errors.push(`${p.id}: ${updateError.message}`);
                    continue;
                }

                if (!updated || updated.length === 0) {
                    const { error: insertError } = await supabase
                        .from('products_new')
                        .insert({
                            id: p.id,
                            title: p.name,
                            base_price: targetPrice,
                            category: p.category,
                            is_visible: p.is_visible ?? true,
                        });
                    if (insertError) {
                        errorCount++;
                        errors.push(`${p.id}: ${insertError.message}`);
                    } else {
                        successCount++;
                    }
                } else {
                    successCount++;
                }
            }

            loadProducts();
            if (errorCount === 0) {
                alert(`✅ ${successCount} produtos atualizados com sucesso!`);
            } else {
                console.error('[BulkUpdate] Errors:', errors);
                alert(`⚠️ ${successCount} atualizados, ${errorCount} com erro.\n\nPrimeiro erro: ${errors[0]}`);
            }
        } catch (error) {
            console.error('[BulkUpdate] Unexpected error:', error);
            alert(`Erro inesperado: ${String(error)}`);
        } finally {
            setBulkLoading(false);
        }
    };

    const filteredProducts = productsList.filter(p => {
        if (filterCategory === 'all') return true;
        return p.category === filterCategory;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight">Painel de Controle</h1>
                <p className="text-slate-400 text-xs">Visão geral e gerenciamento de inventário</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#1a1a1a] border border-primary/20 rounded-xl p-4 gold-glow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-xl">💰</span>
                        <span className="text-green-500 text-[10px] font-bold">---</span>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Receita Total</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">R$ 0,00</p>
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%]"></div>
                    </div>
                </div>
                <div className="bg-[#1a1a1a] border border-primary/20 rounded-xl p-4 gold-glow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-xl">🛒</span>
                        <span className="text-green-500 text-[10px] font-bold">---</span>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">0</p>
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%]"></div>
                    </div>
                </div>
                <div className="bg-[#1a1a1a] border border-primary/20 rounded-xl p-4 gold-glow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-xl">📦</span>
                        <span className="text-slate-500 text-[10px] font-bold">Ao Vivo</span>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">{productsList.length}</p>
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[100%]"></div>
                    </div>
                </div>
                <div className="bg-[#1a1a1a] border border-primary/20 rounded-xl p-4 gold-glow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-xl">👥</span>
                        <span className="text-green-500 text-[10px] font-bold">---</span>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">0</p>
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%]"></div>
                    </div>
                </div>
            </div>

            {/* Core Category Price Shortcuts */}
            <section className="mb-6">
                <div className="bg-[#1a1a1a] border border-primary/20 rounded-xl p-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Preço por Categoria Principal</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { key: 'Futebol', label: 'Masculina (Futebol)' },
                            { key: 'Feminino', label: 'Feminina' },
                            { key: 'Infantil', label: 'Kids (Infantil)' },
                            { key: 'NBA', label: 'Basquete (NBA)' },
                        ].map(({ key, label }) => (
                            <div key={key} className="flex flex-col gap-2 p-3 bg-background-dark rounded border border-slate-700">
                                <span className="text-white text-xs font-bold">{label}</span>
                                <div className="flex gap-2 items-center">
                                    <span className="text-primary text-xs">R$</span>
                                    <input
                                        type="number"
                                        value={catPrices[key]}
                                        onChange={(e) => setCatPrices(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                                        className="flex-1 min-w-0 bg-[#1a1a1a] border border-slate-700 focus:border-primary text-white text-xs px-2 py-1 rounded outline-none"
                                        step="1"
                                        min="0"
                                    />
                                    <button
                                        onClick={() => handleBulkUpdate(key, catPrices[key])}
                                        disabled={bulkLoading}
                                        className="bg-primary hover:bg-primary-hover text-black px-2 py-1 rounded text-xs font-bold transition-colors shrink-0"
                                    >
                                        ✓
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Inventory Management */}
            <section>
                {/* Category Filters for List */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {coreCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filterCategory === cat.id
                                ? 'bg-primary border-primary text-black'
                                : 'bg-background-dark border-slate-700 text-slate-400 hover:border-primary/50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest shrink-0">Catálogo ({filteredProducts.length})</h3>

                    {/* Bulk Edit Controls Custom */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#1a1a1a] border border-primary/20 rounded-lg p-2">
                        <span className="text-slate-400 text-[10px] font-bold uppercase ml-1">Att Custom:</span>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-background-dark text-white border border-slate-700 text-xs rounded px-2 py-1 max-w-[150px]"
                        >
                            <option value="">Outra Categoria...</option>
                            {categories.filter(c => !['Futebol', 'Feminino', 'Infantil', 'Basquete'].includes(c)).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-1">
                            <span className="text-primary text-xs ml-1">R$</span>
                            <input
                                type="number"
                                value={bulkPrice}
                                onChange={(e) => setBulkPrice(parseFloat(e.target.value) || 0)}
                                className="w-20 bg-background-dark border border-primary text-primary text-xs font-bold px-2 py-1 rounded"
                                step="0.01"
                            />
                        </div>
                        <button
                            onClick={() => handleBulkUpdate(selectedCategory, bulkPrice)}
                            disabled={bulkLoading || !selectedCategory}
                            className="bg-primary hover:bg-primary-hover text-black px-3 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50"
                        >
                            {bulkLoading ? '...' : 'Aplicar'}
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    {filteredProducts.map((product, index) => {
                        const stock = product.stock_quantity ?? 0;
                        const isEditing = editingId === product.id;

                        return (
                            <div key={product.id} className={`bg-[#1a1a1a] border-l-2 ${index % 2 === 0 ? 'border-primary' : 'border-slate-800'} rounded-r-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4`}>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="w-10 h-10 bg-background-dark rounded border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                                        <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                                    </div>
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full bg-background-dark border border-slate-700 text-white text-xs px-2 py-1 rounded"
                                            />
                                        ) : (
                                            <p className="text-white text-xs font-bold truncate w-48 lg:w-64">{product.name}</p>
                                        )}

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                className="w-full bg-background-dark border border-slate-700 text-white text-[10px] px-2 py-1 rounded mt-1"
                                            />
                                        ) : (
                                            <p className="text-slate-500 text-[10px]">{product.category}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t border-slate-800 pt-3 md:border-0 md:pt-0">
                                    <div className="text-right">
                                        {isEditing ? (
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-primary text-xs">R$</span>
                                                <input
                                                    type="number"
                                                    value={editForm.price}
                                                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                                                    className="w-20 bg-background-dark border border-primary text-primary text-xs font-bold px-2 py-1 rounded"
                                                    step="0.01"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-primary text-xs font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                                        )}
                                        <p className="text-slate-400 text-[10px]">Estoque: <span className={stock > 0 ? "text-primary" : "text-red-500"}>{stock}</span></p>
                                    </div>

                                    <div className="flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => setEditingId(null)} disabled={loading} className="text-slate-400 hover:text-white transition-colors text-xs border border-slate-700 rounded px-2 py-1">Cancelar</button>
                                                <button onClick={() => handleSave(product.id)} disabled={loading} className="text-black bg-primary hover:bg-primary-hover font-bold transition-colors text-xs border border-primary rounded px-3 py-1">{loading ? '...' : 'Salvar'}</button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEditClick(product)} className="text-slate-400 hover:text-primary transition-colors text-sm px-2">✏️</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
