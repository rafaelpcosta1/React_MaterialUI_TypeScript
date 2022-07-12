import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { PessoasServices } from '../../shared/services/api/pessoas/PessoasServices';

export const ListagemDePessoas: React.FC = () => {
  const [searchParams, setSerachParams] = useSearchParams();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    PessoasServices.getAll(1, busca)
      .then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        }
        else {
          console.log(result);
        }
      });
  }, [busca]);

  return (
    <LayoutBaseDePagina
      titulo='Listagem de pessoas'
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo='Nova'
          aoMudarTextoDaBusca={texto => setSerachParams({ busca: texto }, { replace: true })}
        />
      }
    >

    </LayoutBaseDePagina>
  );
};