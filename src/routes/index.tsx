import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import { HomePage, ListagemDeCidade } from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'location_city',
        path: '/cidades',
        label: 'Cidades',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<HomePage />} />
      <Route path='/cidades' element={<ListagemDeCidade />} />
      {/*<Route path='/cidades/detalhe/:id' element={ <ListagemDeCidade />} />*/}

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};