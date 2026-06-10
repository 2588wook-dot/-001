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
    
    if (querySnapshot.empty) {
      console.log('Firestore projects collection is empty. Seeding INITIAL_PROJECTS...');
      const seeded = await seedInitialProjects();
      return seeded;
    }
    
    const list: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
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
    });
    return list;
  } catch (err) {
    console.warn('Error fetching ordered projects, trying unordered fetch:', err);
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (querySnapshot.empty) {
        const seeded = await seedInitialProjects();
        return seeded;
      }
      const list: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
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
      });
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
      batch.set(docRef, {
        id: proj.id,
        title: proj.title,
        category: proj.category,
        location: proj.location,
        area: proj.area,
        period: proj.period,
        description: proj.description,
        thumbnail: proj.thumbnail,
        images: proj.images,
        createdAt: proj.createdAt instanceof Date ? proj.createdAt.toISOString() : proj.createdAt,
        featured: proj.featured,
        position: index,
      });
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
      batch.set(docRef, {
        id: proj.id,
        title: proj.title,
        category: proj.category,
        location: proj.location,
        area: proj.area,
        period: proj.period,
        description: proj.description,
        thumbnail: proj.thumbnail,
        images: proj.images,
        createdAt: proj.createdAt,
        featured: proj.featured,
        position: index,
      });
    });
    await batch.commit();
    console.log('Seeded initial projects into Firestore successfully.');
    return INITIAL_PROJECTS;
  } catch (err) {
    console.error('Failed to seed initial projects:', err);
    return INITIAL_PROJECTS;
  }
}
