import { RpcExceptionFilter, ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class AccountExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): any {
        const err = exception.getError();
        return err;
    }

    
    // catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    //     const ctx = host.switchToHttp();
    //     const err = exception.getError();
    //     const response = ctx.getResponse<Response>();
    //     const request = ctx.getRequest<Request>();
    //     const status = exception.getStatus();

    //     console.log("Hello",exception);
    //     throw new HttpException(exception.message,status);
    //     // response.json({
    //     //     message: err["details"],
    //     //     status: err['code'],
    //     //     timestamp: new Date().toISOString(),
    //     //     path: request.url,
    //     //   });
    // }
}