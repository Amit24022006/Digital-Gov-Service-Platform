import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Service } from '../models/Service.js';
import { OfficeLocation } from '../models/OfficeLocation.js';
import { Grievance } from '../models/Grievance.js';
import {
  Notification,
  Feedback,
  SavedService,
  AuditLog
} from '../models/Others.js';
import {
  categoriesData,
  servicesData,
  officeLocationsData,
  sampleNotificationsData
} from '../seed/seedData.js';

const upsertManyById = async (Model, docs) => {
  if (!docs?.length) return { inserted: 0, updated: 0 };
  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { id: doc.id },
      update: { $set: doc },
      upsert: true
    }
  }));
  const result = await Model.bulkWrite(ops, { ordered: false });
  return {
    inserted: result.upsertedCount || 0,
    updated: result.modifiedCount || 0
  };
};

export const connectAndSeedMongo = async (mongoUri) => {
  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  });

  console.log('🍃 Connected to MongoDB at:', mongoUri);
  console.log(
    '📊 Mongoose connection state:',
    mongoose.connection.readyState === 1 ? 'Connected' : 'Unknown'
  );

  const catResult = await upsertManyById(Category, categoriesData);
  console.log(
    `✅ Categories synced (${categoriesData.length} records, ${catResult.inserted} inserted, ${catResult.updated} updated).`
  );

  const srvResult = await upsertManyById(Service, servicesData);
  console.log(
    `✅ Services synced (${servicesData.length} records, ${srvResult.inserted} inserted, ${srvResult.updated} updated).`
  );

  const offResult = await upsertManyById(OfficeLocation, officeLocationsData);
  console.log(
    `✅ Offices synced (${officeLocationsData.length} records, ${offResult.inserted} inserted, ${offResult.updated} updated).`
  );

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@govdesk.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'National Admin Officer';

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const password_hash = await bcrypt.hash(adminPassword, 10);
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      phone: '9811002233',
      password_hash,
      role: 'superadmin',
      state: 'All India',
      city: 'New Delhi',
      is_active: true,
      preferences: categoriesData.map((c) => c.id)
    });
    console.log(`✅ Created SuperAdmin: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log(`✅ SuperAdmin account already exists: ${adminEmail}`);
  }

  const demoEmail = 'citizen@govdesk.in';
  let demoCitizen = await User.findOne({ email: demoEmail });
  if (!demoCitizen) {
    const password_hash = await bcrypt.hash('citizen123', 10);
    demoCitizen = await User.create({
      name: 'Rajesh Kumar Sharma',
      email: demoEmail,
      phone: '9876543210',
      password_hash,
      role: 'citizen',
      state: 'Delhi',
      city: 'New Delhi',
      is_active: true,
      preferences: ['cat_farmer', 'cat_education', 'cat_health']
    });
    console.log('✅ Created demo citizen: citizen@govdesk.in (password: citizen123)');
  }

  const notifCount = await Notification.countDocuments();
  if (notifCount === 0 && sampleNotificationsData?.length > 0) {
    const notifications = sampleNotificationsData.map(({ id, ...rest }) => ({
      ...rest,
      user_id: null,
      type: rest.type === 'warning' ? 'warning' : rest.type
    }));
    await Notification.insertMany(notifications);
    console.log(`✅ Seeded ${notifications.length} broadcast notifications.`);
  }

  if (demoCitizen && (await Grievance.countDocuments()) === 0) {
    await Grievance.create({
      tracking_number: 'GOV-GRV-2026-8819AB',
      user_id: demoCitizen._id.toString(),
      user_name: demoCitizen.name,
      user_email: demoCitizen.email,
      phone: demoCitizen.phone,
      category: 'Farmer & Agriculture',
      service_name: 'PM-KISAN',
      subject: '16th Installment eKYC status not updated after bank biometric',
      description:
        'Completed biometric eKYC at Connaught Place CSC on 12th Aug, but portal still displays pending verification.',
      status: 'Under Review',
      priority: 'High',
      admin_response:
        'Your ticket has been assigned to the District Agriculture Nodal Officer for re-synchronization with UIDAI gateway.'
    });
    console.log('✅ Seeded sample grievance for demo citizen.');
  }

  if (demoCitizen && (await Feedback.countDocuments()) === 0) {
    await Feedback.create({
      user_id: demoCitizen._id.toString(),
      user_name: demoCitizen.name,
      service_id: 'srv_pmkisan',
      service_name: 'PM-KISAN',
      rating: 5,
      comment:
        'Clear document checklist and step-by-step guidance made applying very straightforward!',
      is_approved: true
    });
    console.log('✅ Seeded sample feedback.');
  }

  if (demoCitizen && (await SavedService.countDocuments({ user_id: demoCitizen._id.toString() })) === 0) {
    await SavedService.insertMany([
      { user_id: demoCitizen._id.toString(), service_id: 'srv_pmkisan' },
      { user_id: demoCitizen._id.toString(), service_id: 'srv_pmjay' }
    ]);
    console.log('✅ Seeded saved services for demo citizen.');
  }

  if ((await AuditLog.countDocuments()) === 0 && adminUser) {
    await AuditLog.create({
      admin_id: adminUser._id.toString(),
      admin_name: adminUser.name,
      action: 'SYSTEM_INITIALIZE',
      entity: 'System',
      details: 'GovDesk MongoDB initialized with categories, schemes, and offices.'
    });
  }

  console.log('');
  console.log('🚀 GovDesk MongoDB Database: Fully Initialized & Synchronized');
  console.log(`   📦 Categories: ${await Category.countDocuments()}`);
  console.log(`   📋 Services:   ${await Service.countDocuments()}`);
  console.log(`   🏢 Offices:    ${await OfficeLocation.countDocuments()}`);
  console.log(`   👤 Users:      ${await User.countDocuments()}`);
  console.log(`   🎫 Grievances: ${await Grievance.countDocuments()}`);
  console.log('');
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
