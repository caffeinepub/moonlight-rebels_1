import { useState } from 'react';
import AdminGuard from '../components/AdminGuard';
import StripeSetup from '../components/StripeSetup';
import { useIsStripeConfigured, useGetPartners, useAddPartner, useDeletePartner } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Settings, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import type { PartnerData } from '../backend';

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}

function AdminContent() {
  const { data: isStripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();
  const { data: partners, isLoading: partnersLoading } = useGetPartners();
  const addPartner = useAddPartner();
  const deletePartner = useDeletePartner();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    partnerType: 'partner' as 'partner' | 'sponsor' | 'affiliate',
    details: '',
    category: '',
    requiresSubscription: false,
  });

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPartner.name.trim() || !newPartner.details.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert string type to Motoko variant format
    const partnerTypeVariant = { [newPartner.partnerType]: null } as any;

    try {
      await addPartner.mutateAsync({
        id: BigInt(0),
        name: newPartner.name.trim(),
        partnerType: partnerTypeVariant,
        details: newPartner.details.trim(),
        category: newPartner.category.trim(),
        requiresSubscription: newPartner.requiresSubscription,
      });
      
      toast.success('Partner added successfully!');
      setNewPartner({
        name: '',
        partnerType: 'partner',
        details: '',
        category: '',
        requiresSubscription: false,
      });
      setShowAddForm(false);
    } catch (error) {
      toast.error('Failed to add partner');
      console.error(error);
    }
  };

  const handleDeletePartner = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      await deletePartner.mutateAsync(id);
      toast.success('Partner deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete partner');
      console.error(error);
    }
  };

  // Helper to get partner type string from variant
  const getPartnerTypeString = (partnerType: any): string => {
    if (partnerType.partner !== undefined) return 'partner';
    if (partnerType.sponsor !== undefined) return 'sponsor';
    if (partnerType.affiliate !== undefined) return 'affiliate';
    return 'partner';
  };

  return (
    <div className="py-12 px-4">
      <div className="container max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-moonlight-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-moonlight-400 to-rebel-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        {/* Stripe Configuration */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Payment Configuration</h2>
          {stripeLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading Stripe configuration...</span>
            </div>
          ) : isStripeConfigured ? (
            <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold">Stripe is configured</p>
                <p className="text-sm text-muted-foreground">Payment processing is active</p>
              </div>
            </div>
          ) : (
            <StripeSetup />
          )}
        </div>

        {/* Partner Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Partner Management</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white rounded-lg font-medium flex items-center gap-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Partner</span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddPartner} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-moonlight-500"
                    placeholder="Partner name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <select
                    value={newPartner.partnerType}
                    onChange={(e) => setNewPartner({ ...newPartner, partnerType: e.target.value as 'partner' | 'sponsor' | 'affiliate' })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-moonlight-500"
                  >
                    <option value="partner">Partner</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={newPartner.category}
                  onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-moonlight-500"
                  placeholder="e.g., Gaming, Tech, Lifestyle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Details *</label>
                <textarea
                  value={newPartner.details}
                  onChange={(e) => setNewPartner({ ...newPartner, details: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-moonlight-500 min-h-[100px]"
                  placeholder="Partner details and description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresSubscription"
                  checked={newPartner.requiresSubscription}
                  onChange={(e) => setNewPartner({ ...newPartner, requiresSubscription: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="requiresSubscription" className="text-sm font-medium">
                  Requires subscription to view
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addPartner.isPending}
                  className="px-6 py-2 bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white rounded-lg font-medium disabled:opacity-50 transition-all"
                >
                  {addPartner.isPending ? 'Adding...' : 'Add Partner'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {partnersLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading partners...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {partners && partners.length > 0 ? (
                partners.map((partner) => (
                  <div key={partner.id.toString()} className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {getPartnerTypeString(partner.partnerType)} {partner.category && `• ${partner.category}`}
                        {partner.requiresSubscription && ' • 🔒 Premium'}
                      </p>
                      <p className="text-foreground/80">{partner.details}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
                      disabled={deletePartner.isPending}
                      className="ml-4 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-card/50 backdrop-blur border border-border/40 rounded-xl">
                  <p className="text-muted-foreground">No partners added yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
