import mongoose from 'mongoose';

const { Schema } = mongoose;

// User Schema: Defines the structure for user accounts.
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Team Member'], default: 'Team Member' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  otp: { type: String },
  otp_expires: { type: Date },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Team Schema: Defines the structure for teams or organizations.
const TeamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Project Schema: Defines the structure for individual projects.


const ProjectSchema = new Schema(
  {
    projectId: { type: String, unique: true }, // ✅ Custom ID
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // team: { type: Schema.Types.ObjectId, ref: "Team" }, // optional
    status: { type: String, default: "To Do" },
    dueDate: { type: Date },
    route: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Automatically generate projectId if missing
ProjectSchema.pre("save", function (next) {
  if (!this.projectId) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.projectId = `PRJ-${random}`;
  }
  next();
});

// Task Schema: Defines individual tasks assigned to users within projects.
// models/models.js




const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
  type: String,
  enum: [
    "Backlog",
    "Todo",
    "In Progress",
    "In Review",
    "Blocked",
    "Completed",
  ],
  default: "Backlog", // 👈 default can be "Backlog"
},

    priority: { type: String, default: "Medium" },
    dueDate: { type: Date, default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    // 👇 change this
    user: { type: String, default: "Unassigned" }, 
  },
  { timestamps: true }
);








// export const Task =
//   mongoose.models.Task || mongoose.model("Task", taskSchema);


// export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);



// Exporting the models, or reusing them if they already exist
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Task =
  mongoose.models.Task || mongoose.model("Task", TaskSchema);

 