/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: Config will be moved to firebase-config-loader utility if needed,
// but for now we assume set_up_firebase creates the config file.
// We'll lazy load this in the service.
