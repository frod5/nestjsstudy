import { join } from 'path';

//서버 프로젝트의 ROOT
export const PROJECT_ROOT_PATH = process.cwd();
//외부에서 접근 가능한 파일들을 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';
// 포스트 이미지들을 저장할 폴더이름
export const POSTS_FOLDER_NAME = 'posts';

//실제 공개폴더의 절대 경로
// /{프로젝트의 위치}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 포스트 이미지를 저장할 폴더
// /{프로젝트의 위치}/public/posts
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

//절대 경로
// /public/posts/xxx.jpg
export const POST_PUBLIC_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME);
