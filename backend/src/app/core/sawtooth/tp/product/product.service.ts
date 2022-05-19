import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { getProjectConfig } from '../../../../utility/methods/helper.methods';
import { UtilityService } from '../../utility/utility.service';
import { ProductCreationDto } from '../../../../utility/dto/product-creation.dto';
import { KeyPairDto } from '../../../../utility/dto/key-pair.dto';
import { AssetCreationOperation } from '../../../../utility/enum/asset-creation.enum';
import { response } from 'express';

@Injectable()
export class ProductService {
    private sawtoothConfig: any;

    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService
    ) {
        this.sawtoothConfig = getProjectConfig('sawtooth');
    }

    async getById(fishId: string): Promise<AxiosResponse<any>> {
        const fishAddress = this.utilityService.getAssetAddress(fishId);
        return await firstValueFrom(this.httpService.get(`${this.sawtoothConfig.API_URL}/state?address=${fishAddress}`));
    }

    async createNew(data: ProductCreationDto, keyPair: KeyPairDto): Promise<boolean> {
        const result = await this.utilityService.createAsset(AssetCreationOperation.Create, data, keyPair.privateKey, this.sawtoothConfig.FAMILY, this.sawtoothConfig.VERSION, this.sawtoothConfig.PREFIX);
        return result;
    }

    async getAll(): Promise<AxiosResponse<any>> {
        const response = await firstValueFrom(this.httpService.get(`${this.sawtoothConfig.API_URL}/state?address=${this.sawtoothConfig.PREFIX}`).pipe(map(x => x.data)));
        return response;
    }
}
