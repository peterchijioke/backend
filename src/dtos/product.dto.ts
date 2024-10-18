// dto/add-product.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;
}
