import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { PessoasServices } from '../../shared/services/api/pessoas/PessoasServices';
import { VTextField, VForm, useVForm, IVFormErros } from '../../shared/forms';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


interface IFormData {
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}

// Esquema de validação do formulario
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nomeCompleto: yup.string().required().min(3),
  email: yup.string().required().email(),
  cidadeId: yup.number().required(),
});

export const DetalheDePessoas: React.FC = () => {
  // Variaveis constantes utilizada para vavegar entre as paginas e fornecer o ID
  const { id } = useParams<'id'>();
  const navigate = useNavigate();

  // Pega referencias do Unform para salvar os dados e usar em outro lugar
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

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
            formRef.current?.setData(result);
          }
        });
    }
    else {
      formRef.current?.setData({
        nomeCompleto: '',
        cidadeId: '',
        email: '',
      });
    }
  }, [id]);

  // Constante criada para salvar os dados no backend.
  const handleSave = (dados: IFormData) => {

    // Aplicando a validação de erro
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        // Criando usuario na base de dados pelo BackEnd
        if (id === 'adicionar') {
          PessoasServices.create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/pessoas');
                } else {
                  navigate(`/pessoas/detalhe/${result}`);
                }
              }
            });
        }
        // Atualizando usuario na base de dados pelo BackEnd
        else {
          PessoasServices.updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              }
              else {
                if (isSaveAndClose()) {
                  navigate('/pessoas');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErros = {};

        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        console.log(validationErrors);
        formRef.current?.setErrors(validationErrors);
      });
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

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
        />
      }
    >

      {/*OBJETOS FORMULARIOS DA TELA*/}

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

          <Grid container direction='column' padding={2} spacing={2}>

            <Grid>
              {/*BARRA DE CARREGAMENTO DA TELA*/}

              {isLoading && (
                <LinearProgress variant='indeterminate' />
              )}
            </Grid>

            <Grid item>
              {id === 'adicionar' && (
                <Typography variant='h6'>Novo usuário</Typography>
              )}
              {id !== 'adicionar' && (
                <Typography variant='h6'>Usuário</Typography>
              )}
            </Grid>
            <Grid container item direction='row'>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Nome completo'
                  disabled={isLoading}
                  name='nomeCompleto'
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='E-mail'
                  disabled={isLoading}
                  name='email'
                />
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Cidade'
                  disabled={isLoading}
                  name='cidadeId'
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>

    </LayoutBaseDePagina >
  );
};