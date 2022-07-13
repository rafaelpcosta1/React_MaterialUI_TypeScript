import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IListagemPessoa, PessoasServices } from '../../shared/services/api/pessoas/PessoasServices';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { Enviroment } from '../../shared/environment';

export const ListagemDePessoas: React.FC = () => {
  const [searchParams, setSerachParams] = useSearchParams();
  const { debounce } = useDebounce(500, true);
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemPessoa[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      PessoasServices.getAll(pagina, busca)
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
      PessoasServices.deleteById(id)
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
      titulo='Listagem de pessoas'
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/adicionar')}
          aoMudarTextoDaBusca={texto => setSerachParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant='outlined' sx={{ margin: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Nome Completo</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.nomeCompleto}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell width={80}>
                  <IconButton size='small' onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size='small' onClick={() => navigate(`/pessoas/detalhe/${row.id}`)}>
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