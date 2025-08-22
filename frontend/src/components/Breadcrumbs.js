import Breadcrumb from 'react-bootstrap/Breadcrumb';

function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/welcome">Welcome</Breadcrumb.Item>
      <Breadcrumb.Item href="/instruction1" active={true} > Instruction1</Breadcrumb.Item>
      <Breadcrumb.Item href="/waitingroom1" active={true} >Waiting Room 1</Breadcrumb.Item>
      <Breadcrumb.Item href="/practice1" active={true} >Practice 1</Breadcrumb.Item>
      <Breadcrumb.Item href="/exercise1" active={true} >Exercise 1</Breadcrumb.Item>
      <Breadcrumb.Item href="/instruction2" active={true} >Instruction 2</Breadcrumb.Item>
      <Breadcrumb.Item href="/waitingroom2" active={true} >Waiting Room 2</Breadcrumb.Item>
      <Breadcrumb.Item href="/exercise2" active={true} >Exercise 2</Breadcrumb.Item>
      <Breadcrumb.Item href="/questionnaire" active={true} >Questionnaire</Breadcrumb.Item>
      <Breadcrumb.Item href="/end" active={true} >End</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadcrumbExample;