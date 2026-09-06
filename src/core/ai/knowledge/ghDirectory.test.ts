import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrieveDirectoryKnowledge, stockLabel, DirectoryCatalog } from './ghDirectory';

const CATALOG: DirectoryCatalog = {
  doctors: [
    {
      id: 'DOC-101',
      name: 'Prof. Dr. Vikram Sethi',
      specialty: 'Cardiothoracic & Vascular Surgery',
      departmentName: 'Cardiology & Vascular Institute',
      experienceYears: 24,
      consultationFee: 1800,
    },
  ],
  hospitals: [
    { id: 'HSP-IN-DL-000125', name: 'Apex Institute of Medical Sciences & Research Center', city: 'New Delhi', hospitalType: 'Super Specialty' },
  ],
  pharmacyProducts: [
    {
      id: 'prod-1',
      name: 'Paracetamol 500mg Tablets',
      brandName: 'Pyradone',
      genericName: 'Paracetamol',
      strength: '500mg',
      dosageForm: 'Tablet',
      price: 30.5,
      availability: 'out_of_stock',
      pharmacyPartnerName: 'Apex Central Clinical Dispensary',
    },
    {
      id: 'prod-2',
      name: 'Cetirizine 10mg Tablets',
      brandName: 'Cetriz',
      genericName: 'Cetirizine',
      availability: 'in_stock',
      price: 12,
      pharmacyPartnerName: 'GlobalHealth Express Central Hub',
    },
    {
      id: 'prod-3',
      name: 'Mystery Product',
      availability: 'something-else',
    },
    {
      id: 'prod-4',
      name: 'Jan Aushadhi Paracetamol 650mg Tablets',
      brandName: 'PMBJP Paracetamol',
      genericName: 'Paracetamol IP 650mg',
      availability: 'in_stock',
      price: 12,
      pharmacyPartnerName: 'Apex Central Clinical Dispensary',
    },
  ],
};

test('finds a doctor by name from the real directory with source label', () => {
  const hits = retrieveDirectoryKnowledge('Is Dr. Vikram Sethi available?', 3, CATALOG);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].kind, 'doctor');
  assert.ok(hits[0].name.includes('Vikram Sethi'));
  assert.ok(hits[0].source.includes('GlobalHealth Doctor Directory'));
  assert.equal(hits[0].entityId, 'DOC-101');
});

test('finds a hospital by name and city context', () => {
  const byName = retrieveDirectoryKnowledge('Tell me about Apex Institute of Medical Sciences', 3, CATALOG);
  assert.ok(byName.some((h) => h.kind === 'hospital' && h.name.includes('Apex')));
  const byCity = retrieveDirectoryKnowledge('I need a hospital in New Delhi', 3, CATALOG);
  assert.ok(byCity.some((h) => h.kind === 'hospital' && h.name.includes('Apex')));
});

test('stock status is reported EXACTLY as the data states — never upgraded', () => {
  assert.equal(stockLabel('in_stock'), 'IN STOCK');
  assert.equal(stockLabel('low_stock'), 'LOW STOCK');
  assert.equal(stockLabel('out_of_stock'), 'OUT OF STOCK');
  assert.equal(stockLabel('weird-value'), 'UNKNOWN');
  assert.equal(stockLabel(undefined), 'UNKNOWN');

  const hits = retrieveDirectoryKnowledge('Paracetamol price and availability', 5, CATALOG);
  const para = hits.find((h) => h.kind === 'pharmacy-product' && h.name.includes('Paracetamol'));
  assert.ok(para, 'paracetamol product should be found');
  assert.ok(para.details.includes('OUT OF STOCK'));
  assert.ok(!para.details.includes('IN STOCK'), 'out-of-stock must never be presented as in stock');
});

test('in-stock product is found and includes partner + price as listed', () => {
  const hits = retrieveDirectoryKnowledge('Do you have Cetirizine in stock?', 5, CATALOG);
  const cet = hits.find((h) => h.kind === 'pharmacy-product' && h.name.includes('Cetirizine'));
  assert.ok(cet);
  assert.ok(cet.details.includes('IN STOCK'));
  assert.ok(cet.details.includes('GlobalHealth Express Central Hub'));
});

test('products are found by a distinctive generic word even with packaging text', () => {
  // Users say "paracetamol", never "Jan Aushadhi Paracetamol 650mg Tablets".
  const hits = retrieveDirectoryKnowledge('Do you have paracetamol in stock?', 5, CATALOG);
  const generics = hits.filter((h) => h.kind === 'pharmacy-product');
  assert.ok(generics.length >= 2, 'both paracetamol products should be found');
  assert.ok(generics.every((h) => h.details.includes('Stock status:')));
});

test('no matches returns empty array — never fabricated entities', () => {
  const hits = retrieveDirectoryKnowledge('Dr. Whoever Fake Person from Nowhere Hospital', 3, CATALOG);
  assert.equal(hits.length, 0);
});

test('null/undefined catalog is safe', () => {
  assert.equal(retrieveDirectoryKnowledge('anything', 3, null).length, 0);
  assert.equal(retrieveDirectoryKnowledge('anything', 3, undefined).length, 0);
});
