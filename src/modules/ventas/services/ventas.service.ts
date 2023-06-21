import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryEnum } from 'src/shared/enums';
import { ProductEntity } from '../entities';
import { Repository, ReturnDocument } from 'typeorm';
import { CreateProductDto, FilterProductDto, ReadProductDto } from '../dtos';

@Injectable()
export class VentasService {
constructor(
    @Inject(RepositoryEnum.PRODUCT_REPOSITORY)
    private repository:Repository<ProductEntity>
)
async create(payload: CreateProductDto): Promise<ServiceResponseHttpModel>{
    const newProduct = this.repository.create(payload);
    const productCreated = await this.repository.save(newProduct);

    return {data: plainToInstance(ReadProductDto, productCreated)}
}
async catalogue(): Promise<ServiceResponseHttpModel>{
    const response = this.repository.findAndCount({take: 1000});
    return {data: response[0],
            pagination: {totalItems: response[1], limit: 10}
        };
}

async findAll(params? : FilterProductDto):Promise<ServiceResponseHttpModel>{
    //😁
    if (params?.limit > 0 && params? >=0) {
        return this.paginateAndFilter(params);
    }
    const response = await this.repository.findAndCount({
        order:{updateAt: 'ASC'},
    });
    
    return {
        data: plainToInstance(ReadProductDto, response[0]),
        pagination: {totalItems: response[1],limit 10},
    }

}
async findOne(id:string):Promise<ServiceResponseHttpModel>{
    //😁
    const response = this.repository.findOne({
        where: {id},
    });
    if (!response) {
        throw new NotFoundException('La información no ha sido encontrada');
    }
    return response;    
}
}


