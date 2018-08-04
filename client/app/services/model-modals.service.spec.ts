import { ModelModalsService } from './model-modals.service';

describe('ModelModalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelModalsService]
    });
  });

  it('should be created', inject([ModelModalsService], (service: ModelModalsService) => {
    expect(service).toBeTruthy();
  }));
});
