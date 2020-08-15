import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigurationService implements MongooseOptionsFactory{
    constructor(private configService: ConfigService){}

    createMongooseOptions():MongooseModuleOptions {
        const dbUserName = this.configService.get<string>('database.userName') || this.configService.get<string>('DATABASE_USERNAME');
        const dbPassword = this.configService.get<string>('database.password') || this.configService.get<string>('DATABASE_PASSWORD');
        const dbName = this.configService.get<string>('database.dbName');
        return {
            uri: "mongodb+srv://"+dbUserName+":"+dbPassword+"@node-training-ctrgf.mongodb.net/"+dbName+"?retryWritres=true&w=majority",
        };
    }

}
