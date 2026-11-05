import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EmpresasService } from '../empresas/empresas.service.js';

@Injectable()
export class ClientesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly empresas: EmpresasService
  ) { }

  async create(empresaId: number, dto: CreateClienteDto) {
    await this.empresas.validarEmpresaAtiva(empresaId);
    await this.validaTelefoneDisponivel(empresaId, dto.telefone);

    return this.prisma.cliente.create({
      data: { ...dto, empresaId }
    })

  }
/*  findAll() {
    return this.prisma.empresa.findMany({ orderBy: { nome: `asc` } });
  }*/
  findAll() {
    return this.prisma.cliente.findMany({ orderBy: { nome: 'asc' } }); 
  }
/*   async findOne(id: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id }
    })

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada')
    }

    return empresa;
  }
  */

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }

  private async validaTelefoneDisponivel(
    empresaId: number,
    telefone: string,
    ignorarId?: number
  ) {
    const existe = await this.prisma.cliente.findUnique({
      where: { empresaId_telefone: { empresaId, telefone } }
    })

    if (existe && existe.id !== ignorarId) {
      throw new ConflictException('Telefone já cadastrado nesta empresa')
    }
  }
}
