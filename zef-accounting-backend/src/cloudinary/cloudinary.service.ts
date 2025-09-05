import {
  Injectable,InternalServerErrorException} from '@nestjs/common';
import { v2 as cloudinaryV2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Upload image to Cloudinary

  async uploadImage(file: Express.Multer.File , folder : string): Promise<any> {
    try {
      return new Promise<any>((resolve, reject) => {
        // Set up the upload stream with Cloudinary options
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          { resource_type: 'image', folder: `Zef-Market/${folder}` },
          (error, result) => {
            if (error) {
              console.error('Error uploading to Cloudinary:', error);
              reject(
                new InternalServerErrorException('Cloudinary upload failed'),
              );
            }
            resolve(result);
          },
        );

        // Push the file buffer into the stream
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Internal server error during Cloudinary upload:', error);
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary upload',
      );
    }
  }

  //   Remove image from Cloudinary
  async removeImage(imagePublicId: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinaryV2.uploader.destroy(imagePublicId, (error, result) => {
          if (error) {
            console.error('Error removing image from Cloudinary:', error);
            reject(
              new InternalServerErrorException('Cloudinary removal failed'),
            );
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Internal server error during Cloudinary removal:', error);
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary removal',
      );
    }
  }

  //   Remove multiple images from Cloudinary
  async removeMultipleImages(publicIds: string[]): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinaryV2.api.delete_resources(publicIds, (error, result) => {
          if (error) {
            console.error(
              'Error removing multiple images from Cloudinary:',
              error,
            );
            reject(
              new InternalServerErrorException(
                'Cloudinary multiple removal failed',
              ),
            );
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error(
        'Internal server error during Cloudinary multiple removal:',
        error,
      );
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary multiple removal',
      );
    }
  }
}
