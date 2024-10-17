
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveItemFromCartDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;
}
