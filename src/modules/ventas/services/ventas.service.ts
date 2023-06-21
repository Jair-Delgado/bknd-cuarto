import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryEnum } from 'src/shared/enums';
import { ProductEntity } from '../entities';
import { FindOptions, FindOptionsWhere, ILike, Repository, ReturnDocument } from 'typeorm';
import { CreateProductDto, FilterProductDto, ReadProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class VentasService {
constructor(
    @Inject(RepositoryEnum.PRODUCT_REPOSITORY)
    private repository:Repository<ProductEntity>
)
async create(payload: CreateProductDto){
    const newProduct = this.repository.create(payload);
    const productCreated = await this.repository.save(newProduct);

    return {data: plainToInstance(ReadProductDto, productCreated)}
}
async catalogue(){
    const response = this.repository.findAndCount({take: 1000});
    return {data: response[0],
            pagination: {totalItems: response[1], limit: 10}
        };
}

async findAll(params? : FilterProductDto){
    //😁
    if (params?.limit > 0 && params? >=0) {
        return this.paginateAndFilter(params);
    }
    const response = await this.repository.findAndCount({
        order:{updateAt: 'ASC'},
    });
    
    return {
        data: plainToInstance(ReadProductDto, response[0]),
        pagination: {totalItems: response[1],limit: 10},
    }

}
async findOne(id:string){
    //😁
    const response = await this.repository.findOne({
        where: {id},
    });
    if (!response) {
        throw new NotFoundException('La información no ha sido encontrada');
    }
    return response;    
}
async update(id: string, payload:UpdateProductDto){
    const response = await  this.repository.findOneBy({id});
    if (!response) {
        throw new NotFoundException('La información no ha sido encontrada');
    }
    this.repository.merge(response, payload)
    return this.repository.save(response);
}
async remove(id: string){
    const response = await this.repository.findOneBy({id});
    if(!response){
        throw new NotFoundException('La información no ha sido encontrada');
    }
    return this.repository.softRemove(response);
}
async removeAll(payload: ProductEntity[]){
    return this.repository.softRemove(payload);
}

private async paginateAndFilter(params: FilterProductDto){
    let where: 
    | FindOptionsWhere<ProductEntity>
    | FindOptionsWhere<ProductEntity>[];
    where = {};
    let {page, search} = params;
    const {limit} = params;
    if (search) {
        search = search.trim(),
        page = 0;
        where = [];
        /*where.push({
            name:ILike($%{search})
        })*/
    }
    const data = this.repository.findAndCount({
        relations: 
    })
}
}


