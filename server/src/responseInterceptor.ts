import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

//  Interface for define the shape of the response object
export interface Response<T> {
  message: string;
  success: boolean;
  result: any;
  error: null;
  timestamps: Date;
  statusCode: number;
}

// Custom interceptor class that transforms the response structure
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  // Intercept method to handle and transform the response
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    const path = context.switchToHttp().getRequest().url;
    
    // Handle the next step in the request-response cycle and transform the response
    return next.handle().pipe(
      map((data) => ({
        message: data.message,       
        success: data.success,       
        result: data.result,         
        timestamps: new Date(),     
        statusCode,                 
        path,                        
        error: null,                
      })),
    );
  }
}