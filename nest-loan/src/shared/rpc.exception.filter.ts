import { RpcExceptionFilter, ArgumentsHost, Catch} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class LoanExceptionFilter implements RpcExceptionFilter<RpcException> {

    catch(exception: RpcException, host: ArgumentsHost): any {
        const err = exception.getError();
        console.log(host.getArgs());
        return err;
    }
}