import { NotFoundError } from "../../lib/http/custom_error/ApiError";
import Logger from "../../lib/core/Logger";

import { Address } from "../endpoint/AddressEndpoint";
import { LP_CUSTOMER_SHIPPING_INFORMATION } from '../../lib/mysql/models/LP_CUSTOMER_SHIPPING_INFORMATION';

export class AddressRepository {

    public addAddress = async (input: Address) => {
        await LP_CUSTOMER_SHIPPING_INFORMATION.create(input);
    }

    public updateAddress = async (input: Address) => {
        await LP_CUSTOMER_SHIPPING_INFORMATION.update(input,
            {
                where: {
                    id: input.id,
                },
            },
        )
    }

    public getAddressById = async (id: string) => {
        const product = await LP_CUSTOMER_SHIPPING_INFORMATION.findOne(
            {
                where: {
                    id: id
                }
            });
        return product
    }


    public deleteAddress = async (id: string) => {

        const Address = await LP_CUSTOMER_SHIPPING_INFORMATION.findOne({
            where: {
                id: id,
            }
        }
        );
        if (!Address) {
            Logger.error(`Failed to delete address ${id} not found`);
            throw new NotFoundError(`Product with id ${id} not found`);
        }
        await LP_CUSTOMER_SHIPPING_INFORMATION.destroy({
            where: {
                id: id,
            },
        });
    }

    public getAddressByBuyerId = async (id: string) => {

        const results = await LP_CUSTOMER_SHIPPING_INFORMATION.findAll({
            where: {
                buyerId: id,
            }
        })

        return results
    }
}