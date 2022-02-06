import { v4 as uuidv4 } from 'uuid';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ระบบทดสอบ';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const REF_TEACHER = process.env.NEXT_PUBLIC_REF_TEACHER || uuidv4();

export const INTERNAL_API_URL = process.env.API_URL || API_URL;
