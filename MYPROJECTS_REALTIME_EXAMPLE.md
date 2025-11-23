# Quick Integration Example: MyProjectsPage with Realtime

## Current MyProjectsPage (Lines 1-100)

The page currently manually fetches projects and manages state. Here's how to convert it to use realtime:

## Step-by-Step Conversion

### 1. Replace imports (Line 1-15)

**Add:**

```typescript
import { useProjects } from "../hooks/useProjects";
```

### 2. Replace state management (Line 17-45)

**Remove:**

```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [userId, setUserId] = useState<string | null>(null);

// Fetch current user
useEffect(() => {
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };
  fetchUser();
}, []);

// Fetch user's projects
useEffect(() => {
  if (userId) {
    fetchProjects();
  }
}, [userId]);

const fetchProjects = async () => {
  // ... manual fetch logic
};
```

**Replace with:**

```typescript
const [userId, setUserId] = useState<string | null>(null);

// Fetch current user ONCE
useEffect(() => {
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };
  fetchUser();
}, []);

// Use realtime hook - that's it!
const { projects, loading, createProject, updateProject, deleteProject } =
  useProjects({
    ownerOnly: true,
    ownerId: userId || undefined,
  });
```

### 3. Update handleSaveProject (around line 107-138)

**Before:**

```typescript
const handleSaveProject = async () => {
  if (editingProject) {
    // Update logic
    const { data, error } = await supabase.from('projects').update({...}).eq('id', editingProject.id);
    if (error) throw error;
    setProjects(projects.map(p => p.id === editingProject.id ? data : p));
  } else {
    // Create logic
    const { data, error } = await supabase.from('projects').insert({...});
    if (error) throw error;
    setProjects([data, ...projects]);
  }
};
```

**After:**

```typescript
const handleSaveProject = async () => {
  try {
    if (editingProject) {
      // Use hook's updateProject - realtime will handle UI update!
      await updateProject(editingProject.id, {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        tags: formData.tags,
      });
    } else {
      // Use hook's createProject - realtime will handle UI update!
      await createProject({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        tags: formData.tags,
      });
    }

    // Close modal and reset form
    setIsCreateEditModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      status: "active",
      tags: [],
      tagInput: "",
    });
  } catch (error: any) {
    console.error("Error saving project:", error);
    alert(error.message);
  }
};
```

### 4. Update handleDeleteProject

**Before:**

```typescript
const handleDeleteProject = async (projectId: string) => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
  if (error) throw error;
  setProjects(projects.filter((p) => p.id !== projectId));
};
```

**After:**

```typescript
const handleDeleteProject = async (projectId: string) => {
  try {
    // Use hook's deleteProject - realtime will handle UI update!
    await deleteProject(projectId);
  } catch (error: any) {
    console.error("Error deleting project:", error);
    alert(error.message);
  }
};
```

## Complete Updated Version (First 150 lines)

```typescript
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { supabase } from '../lib/supabaseClient';
import type { Project } from '../lib/supabaseClient';
import { useProjects } from '../hooks/useProjects'; // NEW!

const MyProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Create/Edit project modal states
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: [] as string[],
    tagInput: ''
  });

  // Fetch current user ONCE
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // 🔥 NEW: Use realtime hook instead of manual fetching!
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects({
    ownerOnly: true,
    ownerId: userId || undefined
  });

  const filteredProjects = projects.filter(project => {
    return project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      status: 'active',
      tags: [],
      tagInput: ''
    });
    setIsCreateEditModalOpen(true);
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status,
      tags: project.tags || [],
      tagInput: ''
    });
    setIsCreateEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      // 🔥 Use hook's deleteProject - realtime handles UI update!
      await deleteProject(projectId);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      alert(`Failed to delete project: ${error.message}`);
    }
  };

  const handleSaveProject = async () => {
    if (!userId) {
      alert('You must be logged in to create/edit projects');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a project title');
      return;
    }

    try {
      if (editingProject) {
        // 🔥 Update existing project - realtime handles UI update!
        await updateProject(editingProject.id, {
          title: formData.title,
          description: formData.description || null,
          status: formData.status,
          tags: formData.tags,
          updated_at: new Date().toISOString()
        });
      } else {
        // 🔥 Create new project - realtime handles UI update!
        await createProject({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          tags: formData.tags,
        });
      }

      // Close modal and reset form
      setIsCreateEditModalOpen(false);
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        status: 'active',
        tags: [],
        tagInput: ''
      });
    } catch (error: any) {
      console.error('Error saving project:', error);

      // Better error messages
      if (error.message?.includes('relation') || error.code === '42P01') {
        alert('❌ Database Error: The projects table does not exist.\n\n' +
              'Please run the database migration script first.');
      } else {
        alert(`Failed to save project: ${error.message}\n\nPlease check the console for details.`);
      }
    }
  };

  const handleAddTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
        tagInput: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Rest of the component remains the same...
  // (JSX rendering, modals, etc.)
```

## ✅ Benefits of This Change

**Before:**

- Manual fetch on mount
- Manual state updates after create/update/delete
- No realtime - need to refresh to see changes from other users

**After:**

- ✅ Automatic fetch on mount
- ✅ Automatic state updates (handled by hook)
- ✅ **REALTIME** - changes from other tabs/users appear instantly!
- ✅ Cleaner code (less manual state management)

## 🧪 Test It!

1. Open project in two browser windows
2. Login with same account
3. In Window 1: Create a new project
4. In Window 2: **Project appears instantly**!
5. In Window 1: Edit the project
6. In Window 2: **Updates appear instantly**!
7. In Window 1: Delete the project
8. In Window 2: **Project disappears instantly**!

---

**That's it!** The same pattern works for ProjectsPage, just use `owner Only: false`.
