import * as Joi from '@hapi/joi'
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotImplementedException,
  Optional,
  PipeTransform
} from '@nestjs/common'
import * as Joiful from 'joiful'
import { Constructor, getJoiSchema } from 'joiful/core'
import { ValidationError } from 'joi'

type Mergeable = Constructor<any>|Joi.AnySchema

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(@Optional() private schemas?: Mergeable[], @Optional() private wrapSchemaAsArray?: boolean) {}
  mergeSchemas (): Joi.AnySchema {
    return this.schemas
    .reduce((merged: Joi.AnySchema, current) => {
      const schema = current.hasOwnProperty('isJoi') && current['isJoi']
      ? current as Joi.AnySchema
      : getJoiSchema(current as Constructor<any>, Joi)
      return merged
      ? merged.concat(schema)
      : schema
    }, undefined) as Joi.Schema
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validateAsSchema (value: any) {
    const { error } = Array.isArray(value) && this.wrapSchemaAsArray
    ? Joi.array().items(this.mergeSchemas()).validate(value)
    : this.mergeSchemas().validate(value)
    if (error) throw new BadRequestException(this.getErrorMessage(error));
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validateAsClass (value: any, metadata: ArgumentMetadata): void|never {
    const { error } = Array.isArray(value)
    ? Joiful.validateArrayAsClass(value, metadata.metatype as Constructor<any>)
    : Joiful.validateAsClass(value, metadata.metatype as Constructor<any>)
    if (error) throw new BadRequestException(this.getErrorMessage(error));
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata?.metatype && !this.schemas) throw new NotImplementedException('Missing validation schema')
    if (this.schemas) this.validateAsSchema(value)
    else this.validateAsClass(value, metadata)
    return value
  }

  getErrorMessage(error:ValidationError):string{

      let errorMessage="",field:any;
      for(field in error.details){
          errorMessage = errorMessage + error.details[field].message+";";
      }
      return  errorMessage;
  }
}