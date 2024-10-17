import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddItemToCartDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;
}
