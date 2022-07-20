import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { CidadesServices } from '../../shared/services/api/cidades/CidadesServices';
import { PessoasServices } from '../../shared/services/api/pessoas/PessoasServices';

export const HomePage = () => {
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [totalCountCidades, setTotalCountCidades] = useState(0);

  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);

  useEffect(() => {
    setIsLoadingCidades(true);
    setIsLoadingPessoas(true);

    PessoasServices.getAll(1)
      .then((result) => {
        setIsLoadingPessoas(false);

        if (result instanceof Error) {
          alert(result.message);
        }
        else {
          setTotalCountPessoas(result.totalCount);
        }
      });

    CidadesServices.getAll(1)
      .then((result) => {
        setIsLoadingCidades(false);

        if (result instanceof Error) {
          alert(result.message);
        }
        else {
          setTotalCountCidades(result.totalCount);
        }
      });

  }, []);

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={2} >

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total de pessoas
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingPessoas && (
                      <Typography variant='h1'>
                        {totalCountPessoas}
                      </Typography>
                    )}
                    {isLoadingPessoas && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={2} >

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total de cidades
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingCidades && (
                      <Typography variant='h1'>
                        {totalCountCidades}
                      </Typography>
                    )}
                    {isLoadingCidades && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>

          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};