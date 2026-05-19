import {
  getPropertiesByInvestor,
  createProperty
} from './realEstate.service';



export const getProperties = async (
  req: any,
  res: any
) => {

  try {

    const properties =
      await getPropertiesByInvestor(
        req.params.investorId
      );

    res.json({
      success: true,
      properties
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });
  }
};



export const addProperty = async (
  req: any,
  res: any
) => {

  try {

    const property =
      await createProperty(req.body);

    res.status(201).json({
      success: true,
      property
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });
  }
};