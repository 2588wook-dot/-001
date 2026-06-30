/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, getDocs, writeBatch, doc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../data/initialProjects';

const COLLECTION_NAME = 'projects';

export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('position', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const list: Project[] = [];
    const idsToDelete: string[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const idNum = parseInt(data.id, 10);
      if (idNum >= 1 && idNum <= 20) {
        idsToDelete.push(data.id);
      } else {
        list.push({
          id: data.id,
          title: data.title,
          category: data.category,
          location: data.location || '',
          area: data.area || '',
          period: data.period || '',
          description: data.description || '',
          thumbnail: data.thumbnail || '',
          images: data.images || [],
          createdAt: data.createdAt,
          featured: data.featured ?? true,
        } as Project);
      }
    });

    if (idsToDelete.length > 0) {
      console.log('Cleaning up old demo projects from Firestore (ordered fetch):', idsToDelete);
      try {
        const batch = writeBatch(db);
        idsToDelete.forEach(id => {
          batch.delete(doc(db, COLLECTION_NAME, id));
        });
        await batch.commit();
      } catch (batchErr) {
        console.error('Failed to clear some demo projects in Firestore:', batchErr);
      }
    }
    
    return list;
  } catch (err) {
    console.warn('Error fetching ordered projects, trying unordered fetch:', err);
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const list: Project[] = [];
      const idsToDelete: string[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const idNum = parseInt(data.id, 10);
        if (idNum >= 1 && idNum <= 20) {
          idsToDelete.push(data.id);
        } else {
          list.push({
            id: data.id,
            title: data.title,
            category: data.category,
            location: data.location || '',
            area: data.area || '',
            period: data.period || '',
            description: data.description || '',
            thumbnail: data.thumbnail || '',
            images: data.images || [],
            createdAt: data.createdAt,
            featured: data.featured ?? true,
          } as Project);
        }
      });

      if (idsToDelete.length > 0) {
        console.log('Cleaning up old demo projects from Firestore (unordered fetch):', idsToDelete);
        try {
          const batch = writeBatch(db);
          idsToDelete.forEach(id => {
            batch.delete(doc(db, COLLECTION_NAME, id));
          });
          await batch.commit();
        } catch (batchErr) {
          console.error('Failed to clear some demo projects in Firestore:', batchErr);
        }
      }
      return list;
    } catch (fallbackErr) {
      handleFirestoreError(fallbackErr, OperationType.LIST, COLLECTION_NAME);
    }
    handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
}

export async function saveProjectsToFirestore(projects: Project[]): Promise<void> {
  try {
    const existingSnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const existingIds = new Set<string>();
    existingSnapshot.forEach((docSnap) => {
      existingIds.add(docSnap.id);
    });

    const batch = writeBatch(db);

    // 1. Add/Update every project with position
    projects.forEach((proj, index) => {
      const docRef = doc(db, COLLECTION_NAME, proj.id);
      
      // Ensure strict type-safety and sanitize fields to avoid undefined values or extra parameters
      const sanitizedProject = {
        id: proj.id || '',
        title: proj.title || '',
        category: (proj.category === 'interior' || proj.category === 'construction' || proj.category === 'remodeling') ? proj.category : 'interior',
        location: proj.location || '',
        area: proj.area || '',
        period: proj.period || '',
        description: proj.description || '',
        thumbnail: proj.thumbnail || '',
        images: Array.isArray(proj.images) ? proj.images.slice(0, 40) : [],
        createdAt: proj.createdAt instanceof Date 
          ? proj.createdAt.toISOString() 
          : (typeof proj.createdAt === 'string' ? proj.createdAt : new Date().toISOString()),
        featured: typeof proj.featured === 'boolean' ? proj.featured : true,
        position: index,
      };

      batch.set(docRef, sanitizedProject);
      existingIds.delete(proj.id);
    });

    // 2. Delete old records that have been removed
    existingIds.forEach((oldId) => {
      const docRef = doc(db, COLLECTION_NAME, oldId);
      batch.delete(docRef);
    });

    await batch.commit();
    console.log(`Successfully synchronized ${projects.length} projects to Firestore.`);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION_NAME);
  }
}

export async function seedInitialProjects(): Promise<Project[]> {
  try {
    const batch = writeBatch(db);
    INITIAL_PROJECTS.forEach((proj, index) => {
      const docRef = doc(db, COLLECTION_NAME, proj.id);
      
      const sanitizedProject = {
        id: proj.id || '',
        title: proj.title || '',
        category: (proj.category === 'interior' || proj.category === 'construction' || proj.category === 'remodeling') ? proj.category : 'interior',
        location: proj.location || '',
        area: proj.area || '',
        period: proj.period || '',
        description: proj.description || '',
        thumbnail: proj.thumbnail || '',
        images: Array.isArray(proj.images) ? proj.images.slice(0, 40) : [],
        createdAt: proj.createdAt instanceof Date 
          ? proj.createdAt.toISOString() 
          : (typeof proj.createdAt === 'string' ? proj.createdAt : new Date().toISOString()),
        featured: typeof proj.featured === 'boolean' ? proj.featured : true,
        position: index,
      };

      batch.set(docRef, sanitizedProject);
    });
    await batch.commit();
    console.log('Seeded initial projects into Firestore successfully.');
    return INITIAL_PROJECTS;
  } catch (err) {
    console.error('Failed to seed initial projects:', err);
    return INITIAL_PROJECTS;
  }
}
