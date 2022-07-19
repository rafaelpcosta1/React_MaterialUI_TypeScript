import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IListagemCidade, CidadesServices } from '../../shared/services/api/cidades/CidadesServices';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Enviroment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';

export const ListagemDeCidades: React.FC = () => {
  const [searchParams, setSerachParams] = useSearchParams();
  const { debounce } = useDebounce(500, true);
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemCidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesServices.getAll(pagina, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          }
          else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data);
          }
        });
    });

  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente apagar o registro?')) {
      CidadesServices.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          }
          else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Registro apagado com sucesso!');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo='Listagem de cidades'
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          aoClicarEmNovo={() => navigate('/cidades/detalhe/adicionar')}
          aoMudarTextoDaBusca={texto => setSerachParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant='outlined' sx={{ margin: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.nome}</TableCell>
                <TableCell width={80}>
                  <IconButton size='small' onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size='small' onClick={() => navigate(`/cidades/detalhe/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Enviroment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>

            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}

            {(totalCount > 0 && totalCount > Enviroment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Enviroment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) => setSerachParams({ busca, pagina: newPage.toString() }, { replace: true })}
                  />
                </TableCell>
              </TableRow>
            )}

          </TableFooter>

        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};