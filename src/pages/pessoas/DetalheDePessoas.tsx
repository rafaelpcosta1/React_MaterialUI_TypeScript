import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { PessoasServices } from '../../shared/services/api/pessoas/PessoasServices';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { VTextField } from '../../shared/forms';

interface IFormData {
  email: string;
  cidadeId: string;
  nomeCompleto: string;
}

export const DetalheDePessoas: React.FC = () => {
  // Variaveis constantes utilizada para vavegar entre as paginas e fornecer o ID
  const { id } = useParams<'id'>();
  const navigate = useNavigate();

  // Pega referencias do Unform para salvar os dados e usar em outro lugar
  const formRef = useRef<FormHandles>(null);

  // Mostrar barra de carregamento na tela.
  const [isLoading, setIsLoading] = useState(false);

  // Variavel constante criada para usar no useEffect 
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

  // Constante criada para salvar os dados no backend.
  const handleSave = (dados: IFormData) => {
    console.log(dados);
  };

  // Constante criada para apagar os dados do backend
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

  // RETORNO DA CONSTANTE EXPORT DetalheDePessoas
  return (
    // Importando base da pagina e criando os objetos
    <LayoutBaseDePagina
      titulo={id === 'adicionar' ? 'Adicionando nova pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoSalavarEFechar
          mostrarBotaoNovo={id !== 'adicionar'}
          mostrarBotaoApagar={id !== 'adicionar'}

          aoClicarEmNovo={() => navigate('/pessoas/detalhe/adicionar')}
          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}

          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
        />
      }
    >
      {isLoading && (
        <LinearProgress variant='indeterminate' />
      )}

      <Form ref={formRef} onSubmit={handleSave}>
        <VTextField name='nomeCompeto' />
        <VTextField name='email' />
        <VTextField name='cidadeId' />
      </Form>

    </LayoutBaseDePagina >
  );
};