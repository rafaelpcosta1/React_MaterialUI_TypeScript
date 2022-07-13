import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { PessoasServices } from '../../shared/services/api/pessoas/PessoasServices';


export const DetalheDePessoas: React.FC = () => {
  const { id } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');


  //Para carregar os dados de outra tela e armazenar a ser utilizado use useEffect
  useEffect(() => {
    if (id !== 'adicionar') {
      setIsLoading(true);

      PessoasServices.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas');
          }
          else {
            setNome(result.nomeCompleto);
            console.log(result);
          }
        });
    }
  }, [id]);

  const handleSave = () => {
    console.log('Save');
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente apagar o registro?')) {
      PessoasServices.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          }
          else {
            alert('Registro apagado com sucesso!');
            navigate('/pessoas');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'adicionar' ? 'Adicionando nova pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoSalavarEFechar
          mostrarBotaoNovo={id !== 'adicionar'}
          mostrarBotaoApagar={id !== 'adicionar'}

          aoClicarEmNovo={() => navigate('/pessoas/detalhe/adicionar')}
          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmSalvar={handleSave}
          aoClicarEmSalvarEFechar={handleSave}
          aoClicarEmApagar={() => handleDelete(Number(id))}
        />
      }
    >
      {isLoading && (
        <LinearProgress variant='indeterminate' />
      )}
      <p>DetalheDePessoas {id}</p>
    </LayoutBaseDePagina >
  );
};