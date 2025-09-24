import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb.js';
import { User, Team, Project, Task } from '../../../../models/models.js';

export async function GET() {
  try {
    await dbConnect();

    // Get current user's team (for demo, we'll get the first team)
    // In a real app, you'd get this from the authenticated user's session
    const currentTeam = await Team.findOne().populate('members');
    
    if (!currentTeam) {
      // Return default stats if no team exists
      return NextResponse.json({
        totalProjects: 0,
        totalTasks: 0,
        myTasks: 0,
        completedTasks: 0,
        teamMembers: 0,
        tasksByStatus: [],
        taskCreationTrend: [],
        recentMembers: [],
        recentProjects: []
      });
    }

    // Get total projects for the team
    const totalProjects = await Project.countDocuments({ team: currentTeam._id });

    // Get total tasks for the team
    const totalTasks = await Task.countDocuments({ team: currentTeam._id });

    // Get my tasks (for demo, we'll use the first user in the team)
    const currentUser = currentTeam.members[0];
    const myTasks = currentUser ? await Task.countDocuments({ 
      team: currentTeam._id, 
      assignee: currentUser._id 
    }) : 0;

    // Get completed tasks
    const completedTasks = await Task.countDocuments({ 
      team: currentTeam._id, 
      status: 'COMPLETED' 
    });

    // Get team members count
    const teamMembers = currentTeam.members.length;

    // Get tasks by status
    const tasksByStatusData = await Task.aggregate([
      { $match: { team: currentTeam._id } },
      { 
        $group: { 
          _id: '$status', 
          count: { $sum: 1 } 
        } 
      }
    ]);

    const tasksByStatus = tasksByStatusData.map(item => ({
      name: item._id,
      value: item.count,
      color: getStatusColor(item._id)
    }));

    // Get task creation trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const taskCreationData = await Task.aggregate([
      { 
        $match: { 
          team: currentTeam._id,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const taskCreationTrend = taskCreationData.map(item => ({
      date: item._id,
      tasks: item.count
    }));

    // Get recent members (last 5)
    const recentMembers = await User.find({ team: currentTeam._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const formattedRecentMembers = recentMembers.map(member => ({
      id: member._id,
      name: member.name,
      email: member.email,
      avatar: member.name.charAt(0).toUpperCase(),
      joinDate: new Date(member.createdAt).toLocaleDateString('en-GB')
    }));

    // Get recent projects (last 5)
    const recentProjects = await Project.find({ team: currentTeam._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    const formattedRecentProjects = await Promise.all(
      recentProjects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        return {
          id: project._id,
          name: project.name,
          taskCount,
          avatar: project.name.charAt(0).toUpperCase(),
          createdDate: new Date(project.createdAt).toLocaleDateString('en-GB')
        };
      })
    );

    return NextResponse.json({
      totalProjects,
      totalTasks,
      myTasks,
      completedTasks,
      teamMembers,
      tasksByStatus,
      taskCreationTrend,
      recentMembers: formattedRecentMembers,
      recentProjects: formattedRecentProjects
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' }, 
      { status: 500 }
    );
  }
}

function getStatusColor(status) {
  const colorMap = {
    'TODO': '#94a3b8',
    'IN_PROGRESS': '#3b82f6',
    'BACKLOG': '#f59e0b',
    'COMPLETED': '#10b981',
    'BLOCKED': '#ef4444',
    'IN_REVIEW': '#8b5cf6'
  };
  return colorMap[status] || '#94a3b8';
}