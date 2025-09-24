import dbConnect from '../../../../lib/mongodb.js';
import { User, Team, Project, Task } from '../../../../models/models.js';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // Create sample team
    const team = new Team({
      name: 'Development Team',
      owner: null, // Will be set after creating owner
    });
    
    // Create sample users with easy-to-remember credentials
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'Admin',
      team: team._id,
      isVerified: true
    });

    const user1 = new User({
      email: 'codewave@example.com',
      password: hashedPassword,
      name: 'Codewave',
      role: 'Team Member',
      team: team._id,
      isVerified: true
    });

    await testUser.save();
    await user1.save();

    // Update team with owner and members
    team.owner = testUser._id;
    team.members = [testUser._id, user1._id];
    await team.save();

    // Create a sample project
    const project1 = new Project({
      name: 'Sample Project',
      description: 'A demo project for testing',
      owner: testUser._id,
      team: team._id,
      status: 'In Progress',
      dueDate: new Date('2025-12-31')
    });

    await project1.save();

    // Create sample tasks
    const tasks = [
      {
        title: 'Setup project',
        description: 'Initialize the project structure',
        status: 'COMPLETED',
        priority: 'high',
        assignee: testUser._id,
        project: project1._id,
        team: team._id,
        dueDate: new Date('2025-03-01')
      },
      {
        title: 'Design UI',
        description: 'Create user interface mockups',
        status: 'IN_PROGRESS',
        priority: 'medium',
        assignee: user1._id,
        project: project1._id,
        team: team._id,
        dueDate: new Date('2025-03-15')
      },
      {
        title: 'Write tests',
        description: 'Add unit tests',
        status: 'TODO',
        priority: 'low',
        assignee: testUser._id,
        project: project1._id,
        team: team._id,
        dueDate: new Date('2025-04-01')
      }
    ];

    // Create tasks with varying dates
    const now = new Date();
    for (let i = 0; i < tasks.length; i++) {
      const task = new Task(tasks[i]);
      
      // Set creation dates for the last 7 days
      const daysAgo = Math.floor(Math.random() * 7);
      const createdDate = new Date(now);
      createdDate.setDate(createdDate.getDate() - daysAgo);
      task.createdAt = createdDate;
      
      await task.save();
    }

    return Response.json({ 
      message: 'Sample data created successfully! You can now login with:\nEmail: test@example.com\nPassword: password123',
      loginCredentials: {
        email: 'test@example.com',
        password: 'password123'
      },
      stats: {
        teams: 1,
        users: 2,
        projects: 1,
        tasks: tasks.length
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}