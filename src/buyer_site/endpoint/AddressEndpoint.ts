import { plainToInstance } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import express from "express";
import { Response } from 'express';

import { ProtectedRequest } from '../../lib/http/app-request';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData } from '../../lib/http/Response';
import { AddressUsecase } from "../usecase/AddressUsecase";


export class AddressEndpoint {

    private addressUsecase: AddressUsecase;

    constructor(addressUsecase: AddressUsecase) {
        this.addressUsecase = addressUsecase;
    }

    private createAddress = async (req: ProtectedRequest, res: Response) => {
        const addAddressRequest = plainToInstance(Address, req.body);
        addAddressRequest.buyerId = req.user.id;
        // addAddressRequest.storeId = req.storeId;

        await validatorRequest(addAddressRequest);
        await this.addressUsecase.addAddress(addAddressRequest);

        return ResponseData("add address success!!!", res);
    };
    private updateAddress = async (req: ProtectedRequest, res: Response) => {
        const updateAddressRequest = plainToInstance(Address, req.body);
        updateAddressRequest.buyerId = req.user.id;
        // updateItemRequest.storeId = req.storeId;

        await validatorRequest(updateAddressRequest);
        await this.addressUsecase.updateAddress(updateAddressRequest);
        return ResponseData("update product success!!!", res);
    }

    private deleteAddress = async (req: ProtectedRequest, res: Response) => {
        const id: string = req.params.id;
        await this.addressUsecase.deleteAddress(id);
        return ResponseData({ message: 'Deleted is successfully!' }, res);

    }


    private getAddress = async (req: ProtectedRequest, res: Response) => {
        const id: string = req.params.id;

        const results = await this.addressUsecase.getAddress(id);
        return ResponseData(results, res)
    }

    private getAddressByBuyerId = async (req: ProtectedRequest, res: Response) => {
        const id = req.user.id;
        const results = await this.addressUsecase.getAddressByBuyerId(id);

        return ResponseData(results, res)


    }




    public getRouter() {
        const router = express.Router();

        router.post('/', this.createAddress);
        router.get('/:id', this.getAddress)
        router.delete('/:id', this.deleteAddress);
        router.put('/', this.updateAddress)
        router.get('/', this.getAddressByBuyerId)

        return router;
    }
}
export class Address {
    id: string

    @IsString()
    @IsNotEmpty()
    buyerId: string;

    @IsString()
    @IsNotEmpty()
    nameKana: string;

    @IsString()
    @IsNotEmpty()
    nameKanji: string;

    @IsString()
    @IsNotEmpty()
    postCode: string;

    @IsString()
    @IsNotEmpty()
    cityTown: string;

    @IsString()
    @IsNotEmpty()
    streetAddress: string;

    @IsString()
    @IsNotEmpty()
    buildingName: string;


    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    telephoneNumber: string;


}


