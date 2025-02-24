const Spinner = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-700 border-t-transparent"></div>
  </div>
  );
};

export default Spinner;




// import styled from 'styled-components';
// const Spinner = () => {
//   return (
//     <StyledWrapper>
//       <div className="loader" />
//     </StyledWrapper>
//   );
// };

// const StyledWrapper = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100vh; /* Ensures the wrapper takes up full viewport height */
//     background-color: white; /* Optional, if you want to set a background color */

//     .loader {
//       position: relative;
//       width: 120px;
//       height: 90px;
//       margin: 0 auto;
//     }

//     .loader:before {
//       content: "";
//       position: absolute;
//       bottom: 30px;
//       left: 50px;
//       height: 30px;
//       width: 30px;
//       border-radius: 50%;
//       background: #40424a;
//       animation: loading-bounce 0.5s ease-in-out infinite alternate;
//     }

//     .loader:after {
//       content: "";
//       position: absolute;
//       right: 0;
//       top: 0;
//       height: 7px;
//       width: 45px;
//       border-radius: 4px;
//       box-shadow: 0 5px 0 #f2f2f2, -35px 50px 0 #f2f2f2, -70px 95px 0 #f2f2f2;
//       animation: loading-step 1s ease-in-out infinite;
//     }

//     @keyframes loading-bounce {
//       0% {
//         transform: scale(1, 0.7);
//       }

//       40% {
//         transform: scale(0.8, 1.2);
//       }

//       60% {
//         transform: scale(1, 1);
//       }

//       100% {
//         bottom: 140px;
//       }
//     }

//     @keyframes loading-step {
//       0% {
//         box-shadow: 0 10px 0 rgba(0, 0, 0, 0),
//                     0 10px 0 #273cd9,
//                     -35px 50px 0 #273cd9,
//                     -70px 90px 0 #273cd9;
//       }

//       100% {
//         box-shadow: 0 10px 0 #273cd9,
//                     -35px 50px 0 #273cd9,
//                     -70px 90px 0 #273cd9,
//                     -70px 90px 0 rgba(0, 0, 0, 0);
//       }
//     }
//   `;

//   export default Spinner;

