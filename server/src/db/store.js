import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { categoriesData, servicesData, officeLocationsData, sampleNotificationsData } from '../seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Store {
  constructor() {
    this.state = {
      users: [],
      categories: [],
      services: [],
      office_locations: [],
      notifications: [],
      grievances: [],
      feedback: [],
      saved_services: [],
      audit_logs: [],
      otp_verifications: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.state = JSON.parse(raw);
        console.log('📦 Loaded existing GovDesk data store.');
      } else {
        this.seedInitial();
      }
    } catch (err) {
      console.warn('⚠️ Error loading existing store, reseeding:', err.message);
      this.seedInitial();
    }
  }

  seedInitial() {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);
    const citizenPasswordHash = bcrypt.hashSync('citizen123', salt);

    this.state = {
      users: [
        {
          id: "usr_admin_1",
          name: "National Portal Admin",
          email: "admin@govdesk.in",
          phone: "9811002233",
          state: "Delhi",
          role: "superadmin",
          preferences: ["cat_farmer", "cat_education", "cat_health", "cat_employment", "cat_housing"],
          password_hash: adminPasswordHash,
          created_at: new Date().toISOString()
        },
        {
          id: "usr_citizen_1",
          name: "Rajesh Kumar Sharma",
          email: "citizen@govdesk.in",
          phone: "9876543210",
          state: "Delhi",
          role: "citizen",
          preferences: ["cat_farmer", "cat_education"],
          password_hash: citizenPasswordHash,
          created_at: new Date().toISOString()
        }
      ],
      categories: categoriesData,
      services: servicesData,
      office_locations: officeLocationsData,
      notifications: sampleNotificationsData,
      grievances: [
        {
          id: "grv_1",
          tracking_number: "GOV-GRV-2026-8819",
          user_id: "usr_citizen_1",
          user_name: "Rajesh Kumar Sharma",
          user_email: "citizen@govdesk.in",
          category: "Farmer & Agriculture",
          service_name: "PM-KISAN",
          subject: "16th Installment eKYC status not updated after bank biometric",
          description: "Completed biometric eKYC at Connaught Place CSC on 12th Aug, but portal still displays pending verification.",
          status: "Under Review",
          admin_response: "Your ticket has been assigned to the District Agriculture Nodal Officer for re-synchronization with UIDAI gateway.",
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      feedback: [
        {
          id: "fb_1",
          user_id: "usr_citizen_1",
          user_name: "Rajesh Kumar Sharma",
          service_id: "srv_pmkisan",
          service_name: "PM-KISAN",
          rating: 5,
          comment: "Clear document checklist and step-by-step guidance made applying very straightforward!",
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ],
      saved_services: [
        {
          id: "save_1",
          user_id: "usr_citizen_1",
          service_id: "srv_pmkisan",
          created_at: new Date().toISOString()
        },
        {
          id: "save_2",
          user_id: "usr_citizen_1",
          service_id: "srv_ayushman",
          created_at: new Date().toISOString()
        }
      ],
      audit_logs: [
        {
          id: "log_1",
          admin_id: "usr_admin_1",
          admin_name: "National Portal Admin",
          action: "SYSTEM_INITIALIZE",
          entity: "System",
          details: "GovDesk digital platform database initialized with 10 categories and initial schemes.",
          ip: "127.0.0.1",
          created_at: new Date().toISOString()
        }
      ],
      otp_verifications: []
    };

    this.save();
    console.log('✅ Seeded GovDesk database store with initial data!');
  }

  save() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist store:', err);
    }
  }

  // Generic collection helpers
  find(collectionName, filterFn = null) {
    const list = this.state[collectionName] || [];
    if (!filterFn) return list;
    return list.filter(filterFn);
  }

  findById(collectionName, id) {
    const list = this.state[collectionName] || [];
    return list.find(item => item.id === id);
  }

  findOne(collectionName, filterFn) {
    const list = this.state[collectionName] || [];
    return list.find(filterFn);
  }

  insertOne(collectionName, item) {
    if (!this.state[collectionName]) {
      this.state[collectionName] = [];
    }
    const doc = {
      id: item.id || `${collectionName.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      created_at: item.created_at || new Date().toISOString(),
      ...item
    };
    this.state[collectionName].unshift(doc);
    this.save();
    return doc;
  }

  insertMany(collectionName, items) {
    if (!this.state[collectionName]) {
      this.state[collectionName] = [];
    }
    const prepared = items.map(item => ({
      id: item.id || `${collectionName.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      created_at: item.created_at || new Date().toISOString(),
      ...item
    }));
    this.state[collectionName].push(...prepared);
    this.save();
    return prepared;
  }

  findByIdAndUpdate(collectionName, id, updates) {
    const list = this.state[collectionName] || [];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.state[collectionName][index] = {
      ...this.state[collectionName][index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.state[collectionName][index];
  }

  deleteOne(collectionName, filterFn) {
    const list = this.state[collectionName] || [];
    const index = list.findIndex(filterFn);
    if (index === -1) return false;
    list.splice(index, 1);
    this.save();
    return true;
  }

  deleteById(collectionName, id) {
    return this.deleteOne(collectionName, item => item.id === id);
  }
}

export const db = new Store();
