import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const HomePage = () => {
  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={(
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo='nova'
        />
      )}
    >
      Testando
    </LayoutBaseDePagina>
  );
};