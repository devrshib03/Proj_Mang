import mongoose from 'mongoose';

const { Schema } = mongoose;

// User Schema: Defines the structure for user accounts.
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Team Member'], default: 'Team Member' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

// Team Schema: Defines the structure for teams or organizations.
const TeamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Project Schema: Defines the structure for individual projects.
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  status: { type: String, default: 'To Do' },
  dueDate: { type: Date },
}, { timestamps: true });

// Exporting the models, or reusing them if they already exist
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
