import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateStation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const confirm = (alert) => {
    toast.success(alert, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const notify = (alert) => {
    toast.error(alert, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/station/${values.id1}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        token: `session_token=${localStorage.getItem("session_token")}`,
      },
      body: JSON.stringify({
        description: values.description1,
      }),
    })
      .then((data) => {
        const { status } = data;
        if (status === 200) confirm("Route Name Updated !!");
        else if (status === 402) notify("This station does not exist");
        else if (status === 401) notify("Error you are not an admin");
        else if (status === 403) notify("This Name is taken choose other name");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box m="20px">
      <Header title="Create Station" subtitle="Create your Station here !" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Old Station Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id1}
                name="id1"
                error={!!touched.id1 && !!errors.id1}
                helperText={touched.id1 && errors.id1}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="New Station Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description1}
                name="description1"
                error={!!touched.description1 && !!errors.description1}
                helperText={touched.description1 && errors.description1}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                style={{ margin: "0 auto" }}
              >
                Update Station
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  description1: yup.string().required("required"),
  id1: yup.string().required("required"),
});
const initialValues = {
  description1: "",
  id1: ""
};

export default CreateStation;
